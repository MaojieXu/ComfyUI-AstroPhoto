"""Seed a reusable equipment fixture into an existing AstroPhoto database.

Run with the project's host Python, from the repository root:
  python scripts/seed_equipment_fixture.py --database PATH_TO_EXISTING_ASSETS_DB
The script never initializes or migrates a database and never overwrites records.
"""
import argparse
import json
import sqlite3
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from astrophoto.database.manager import DatabaseManager, SCHEMA
from astrophoto.equipment.service import EquipmentService, name_key
from astrophoto.equipment.trains import OpticalTrainService

DEVICES = [
    ('primary_optics', "2047STUDIO 12'' F/4 Imaging Newtonian"),
    ('camera', 'ZWO ASI2600MM Pro'),
    ('other', 'Sky-Watcher EQ8-R'),
    *[('filter', f'Antlia {color} 36 mm') for color in ('Blue', 'Green', 'Luminance', 'Red')],
]
TRAIN_NAME = '2047STUDIO 12 F4 - ASI2600MM Pro'


SECOND_DEVICES = [
    ('primary_optics', 'Takahashi FSQ-106EDX III'),
    ('camera', 'Moravian Instruments G4-16000 MK I'),
    ('other', '10Micron GM2000 HPS'),
    *[('filter', f'Astrodon Gen2 E-Series Tru-Balance {color} 50x50 mm')
      for color in ('Blue', 'Green', 'Lum', 'Red')],
    *[('filter', f'Astrodon {band} 5nm 50x50 mm') for band in ('H-alpha', 'OIII', 'SII')],
]
SECOND_SOFTWARE = [
    'Pleiades Astrophoto PixInsight',
    'Russell Croman Astrophotography BlurXTerminator',
    'Russell Croman Astrophotography NoiseXTerminator',
    'Russell Croman Astrophotography StarXTerminator',
]


MORE = {
 '3': [('primary_optics', 'Takahashi TOA-130NFB'), ('camera', 'QHYCCD QHY600PH M SBFL (Short back-focal length)'), ('other', 'iOptron CEM70G'),
       *[('filter', f'Astrodon Gen2 I-Series Tru-Balance {c} 50 mm') for c in ('Blue', 'Green', 'Lum', 'Red')],
       ('filter', 'Astrodon H-alpha 5nm 50 mm'), *[('filter', f'Optolong {c} 36 mm') for c in ('Blue', 'Green', 'H-Alpha 7nm', 'Luminance', 'Red')], ('filter', 'Optolong OIII 6.5nm 2"')],
 '4': [('primary_optics', 'DIY 24" f/4.5 Dobsonian'), ('camera', 'Player One Uranus-M'), ('filter', 'Astronomik ProPlanet 642 BP IR-Pass 1.25"'), ('optical_accessory', 'Explore Scientific 1.25" 3X Extender (FE03-125)')],
 '5': [('primary_optics', 'Lunt LS60T'), ('camera', 'ZWO ASI662MC'), ('other', 'Sky-Watcher SolarQuest'), ('optical_accessory', 'Celestron X-Cel 2x Barlow')],
}
SOFTWARE = {'2': SECOND_SOFTWARE, '4': ['Adobe Photoshop', 'Emil Kraaikamp AutoStakkert!'], '5': ['Torsten Edelmann FireCapture']}


def all_items(service, method):
    items, after = [], None
    while True:
        result = getattr(service, method)(archived='all', after=after, limit=100)
        items.extend(result['items'])
        after = result.get('next')
        if not after:
            return items


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--database', type=Path, required=True, help='Existing initialized assets.db')
    parser.add_argument('--fixture', choices=('1', '2', '3', '4', '5'), default='1')
    args = parser.parse_args()
    devices = {'1': DEVICES, '2': SECOND_DEVICES, **MORE}[args.fixture]
    train_name = '\u8bbe\u5907' + args.fixture
    train_notes = train_name
    path = args.database.resolve(strict=True)
    if not path.is_file():
        parser.error('database must be an existing file')
    with sqlite3.connect(f'{path.as_uri()}?mode=ro', uri=True) as conn:
        version = conn.execute('SELECT version_num FROM alembic_version').fetchone()
    if not version or version[0] != SCHEMA:
        raise RuntimeError(f'Unexpected database schema {version}; expected {SCHEMA}. No migration attempted.')
    db = DatabaseManager(path)
    equipment, trains = EquipmentService(db), OpticalTrainService(db)
    try:
        existing = {name_key(row['name']): row for row in all_items(equipment, 'list_equipment')}
        existing_trains = {name_key(row['name']): row for row in all_items(trains, 'list_trains')}
        for kind, name in devices:
            row = existing.get(name_key(name))
            if row and (row['equipment_type'] != kind or row['product_name'] != name or row['archived_at_utc']):
                raise RuntimeError(f'Conflicting or archived equipment: {name}; no records changed')
        if name_key(train_name) in existing_trains:
            row = existing_trains[name_key(train_name)]
            if row['status'] == 'archived' or any(name_key(name) not in existing for _, name in devices):
                raise RuntimeError('Existing train is archived or fixture equipment is missing; no records changed')
            ids = {name: existing[name_key(name)]['id'] for _, name in devices}
            expected = {'primary_optics_id': ids[devices[0][1]], 'camera_id': ids[devices[1][1]],
                        'other_ids': [ids[name] for kind, name in devices if kind == 'other'],
                        'filter_ids': [ids[name] for kind, name in devices if kind == 'filter'],
                        'accessory_id': next((ids[name] for kind, name in devices if kind == 'optical_accessory'), None),
                        'notes': train_notes}
            if any(row[key] != value for key, value in expected.items()):
                raise RuntimeError('Existing train has different components; no records changed')
        ids, created = {}, []
        for kind, name in devices:
            row = existing.get(name_key(name))
            if row is None:
                row = equipment.create_equipment({'equipment_type': kind, 'name': name, 'product_name': name})
                created.append(name)
            ids[name] = row['id']
        train = existing_trains.get(name_key(train_name))
        if train is None:
            train = trains.create_train({'name': train_name, 'notes': train_notes, 'primary_optics_id': ids[devices[0][1]],
                'camera_id': ids[devices[1][1]], 'other_ids': [ids[name] for kind, name in devices if kind == 'other'],
                'filter_ids': [ids[name] for kind, name in devices if kind == 'filter'],
                'accessory_id': next((ids[name] for kind, name in devices if kind == 'optical_accessory'), None)})
            created.append(train_name)
        train = trains.get_train(train['id'])
        print(json.dumps({'database': str(path), 'created': created, 'equipment': ids,
                          'train': {'id': train['id'], 'name': train['name'], 'notes': train['notes'], 'summary': train['summary']},
                          'software_not_registered': SOFTWARE.get(args.fixture, [])}, ensure_ascii=False, indent=2))
    finally:
        db.engine.dispose()


if __name__ == '__main__':
    main()
