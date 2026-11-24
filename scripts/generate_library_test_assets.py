"""Generate synthetic library fixtures: python scripts/generate_library_test_assets.py OUTPUT.

Requires the project environment (numpy, astropy and imageio-ffmpeg). OUTPUT may
be empty or a previously generated dataset with its complete manifest. Files
are synthetic and intended for library management tests.
"""
from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path

import imageio_ffmpeg
import numpy as np
from astropy.io import fits

GROUPS = [
    ('M31_Light_2600MM_L', 4, 'Light', 'M31', '180s', 'L'),
    ('M31_Light_G416000_Ha', 4, 'Light', 'M31', '180s', 'Ha'),
    ('M42_Light_2600MM_L', 4, 'Light', 'M42', '180s', 'L'),
    ('Flat_2600MM_L', 4, 'Flat', '', '2s', 'L'),
    ('Flat_G416000_Ha', 4, 'Flat', '', '2s', 'Ha'),
    ('Dark_2600MM_180s', 4, 'Dark', '', '180s', ''),
    ('Bias_2600MM', 4, 'Bias', '', '0.001s', ''),
    ('DarkFlat_2600MM_2s', 4, 'DarkFlat', '', '2s', ''),
    ('Light_MinimalName', 3, 'Light', '', '', ''),
    ('Light_AlternateResolution', 2, 'Light', 'M31', '180s', 'L'),
    ('M31_Light_G416000_L', 4, 'Light', 'M31', '120s', 'L'),
    ('M42_Light_QHY600_L', 3, 'Light', 'M42', '60s', 'L'),
    ('Moon_Light_UranusM_IR', 3, 'Light', 'Moon', '0.01s', 'IR'),
    ('Sun_Light_ASI662MC', 3, 'Light', 'Sun', '0.01s', ''),
]

GROUP_EQUIPMENT = {
    'M31_Light_G416000_Ha': ('设备2', 'Astrodon H-alpha 5nm 50x50 mm'),
    'Flat_G416000_Ha': ('设备2', 'Astrodon H-alpha 5nm 50x50 mm'),
    'M31_Light_G416000_L': ('设备2', 'Astrodon Gen2 E-Series Tru-Balance Lum 50x50 mm'),
    'M42_Light_QHY600_L': ('设备3', 'Astrodon Gen2 I-Series Tru-Balance Lum 50 mm'),
    'Moon_Light_UranusM_IR': ('设备4', 'Astronomik ProPlanet 642 BP IR-Pass 1.25"'),
    'Sun_Light_ASI662MC': ('设备5', None),
}
DEFAULT_L = 'Antlia Luminance 36 mm'


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('output', type=Path, help='New output directory (must not exist)')
    args = parser.parse_args()
    root = args.output.resolve()
    root.mkdir(parents=True, exist_ok=True)
    if any(root.iterdir()):
        manifest_path = root / 'manifest.json'
        if not manifest_path.is_file():
            parser.error('nonempty output must contain a generated manifest.json')
        previous = json.loads(manifest_path.read_text(encoding='utf-8'))
        if previous.get('synthetic') is not True or not isinstance(previous.get('files'), list):
            parser.error('output manifest is not a recognized synthetic dataset')
        paths = []
        for item in previous['files']:
            relative = Path(item['path'])
            target = root / relative
            if relative.is_absolute() or '..' in relative.parts or not target.resolve().is_relative_to(root):
                parser.error('invalid path in output manifest')
            paths.append(target)
        if any(path.is_symlink() for path in root.rglob('*')):
            parser.error('output must not contain symbolic links')
        expected = set(paths) | {manifest_path}
        if {path for path in root.rglob('*') if path.is_file()} != expected:
            parser.error('output contains missing or unrecognized files; no files removed')
        for path in paths:
            path.unlink()
        manifest_path.unlink()
    manifest = {'synthetic': True, 'pixel_value': 600, 'groups': [], 'files': [],
                'project_suggestion': {'name': 'M31', 'folders': ['/Raw/L', '/Raw/Ha', '/Integrate', '/Processed']},
                'additional_projects': [{'name': '月面拼接', 'folders': ['/Raw/IR/东区', '/Integrate/IR', '/Processed'],
                                         'references': [
                                             {'material': 'subframes/Moon_Light_UranusM_IR', 'parent': '/Raw/IR/东区'},
                                             {'material': 'master-frames/Master_Moon_L_2600MM.fit', 'parent': '/Integrate/IR'},
                                             {'material': 'image-results/Moon_mosaic_L.fit', 'parent': '/Processed'},
                                             {'material': 'videos/Moon_2600MM_L.mp4', 'parent': '/', 'alias': '月面参考视频'},
                                         ]}],
                'equipment_suggestions': ['设备1', '设备2', '设备3', '设备4', '设备5'],
                'calibration_scenarios': [
                    {'collection': 'subframes/M31_Light_2600MM_L', 'master': 'calibration-masters/Master_Dark_180s_Bin1_2600MM_gain100_-10C.fit', 'expectation': 'matching named parameters'},
                    {'collection': 'subframes/M31_Light_2600MM_L', 'master': 'calibration-masters/Master_Dark_120s_Bin1_2600MM_gain100_-8C.fit', 'expectation': 'exposure differs; temperature is stored but not compared'},
                    {'collection': 'subframes/M31_Light_2600MM_L', 'master': 'calibration-masters/Master_Dark_Unknown.fit', 'expectation': 'parameters missing from name'},
                ]}

    def image(relative: str, kind: str, size: tuple[int, int], group: str | None = None,
              entry: str = 'subframe_collection', **metadata) -> None:
        path = root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        width, height = size
        # Constant synthetic pixel values; these are not calibrated astronomy images.
        pixels = np.full((height, width), 600, dtype=np.uint16)
        hdu = fits.PrimaryHDU(pixels)
        hdu.header['ORIGIN'] = 'Synthetic test data'
        hdu.writeto(path)
        manifest['files'].append({'path': relative, 'category': kind, 'import_entry': entry, 'group': group,
                                  'width': width, 'height': height, **metadata})

    for folder, count, kind, target, exposure, filt in GROUPS:
        camera = ('G416000' if 'G416000' in folder else
                  'QHY600' if folder == 'M42_Light_QHY600_L' else
                  'UranusM' if folder == 'Moon_Light_UranusM_IR' else
                  'ASI662MC' if folder == 'Sun_Light_ASI662MC' else
                  'TestCamera' if folder == 'Light_AlternateResolution' else '2600MM')
        settings = 'gain100'
        parameters = {} if folder == 'Light_MinimalName' else {
            'frame_type': kind, 'target': target or None, 'exposure': exposure or None,
            'camera': camera, 'settings': settings, 'binning': 'Bin1',
            'filter': filt or None, 'temperature_c': -10,
        }
        train_name, filter_name = GROUP_EQUIPMENT.get(folder, ('设备1', DEFAULT_L if filt == 'L' else None))
        manifest['groups'].append({'path': f'subframes/{folder}', 'import_entry': 'subframe_collection',
                                   'count': count, 'named_parameters': parameters, 'train_name': train_name,
                                   'filter_name': filter_name, 'mode': 'reference' if folder == 'Light_MinimalName' else 'copy'})
        for index in range(1, count + 1):
            if folder == 'Light_MinimalName':
                name = f'Light_{index:04d}.fit'
            else:
                parts = [kind, target, exposure, 'Bin1', camera, settings, filt,
                         '20261123-210000', '-10C', f'{index:04d}']
                name = '_'.join(part for part in parts if part) + '.fit'
            size = (2048, 1080) if folder == 'Light_AlternateResolution' else (1920, 1080)
            image(f'subframes/{folder}/{name}', kind, size, folder)

    for name in ('Master_Light_M31_L_2600MM', 'Master_Jupiter_2600MC', 'Master_Moon_L_2600MM'):
        image(f'master-frames/{name}.fit', 'master_frame', (1920, 1080), entry='master_frame')

    for name in ('M31_L_stretched', 'M31_L_denoised', 'Moon_mosaic_L'):
        image(f'image-results/{name}.fit', 'image_result', (1920, 1080), entry='image_result')

    for kind, names in {
        'dark': ('Master_Dark_180s_Bin1_2600MM_gain100_-10C',
                 'Master_Dark_120s_Bin1_2600MM_gain100_-8C', 'Master_Dark_Unknown'),
        'bias': ('Master_Bias_Bin1_2600MM_gain100_-10C', 'Master_Bias_Bin1_ASI662MC_gain100_-10C'),
        'dark_flat': ('Master_DarkFlat_2s_Bin1_2600MM_gain100_-10C',),
        'flat': ('Master_Flat_L_Bin1_2600MM_gain100_-10C',
                 'Master_Flat_Ha_Bin1_G416000_gain100_-10C'),
    }.items():
        for name in names:
            train_name = '设备5' if 'ASI662MC' in name else '设备2' if 'G416000' in name else '设备1'
            filter_name = ('Astrodon H-alpha 5nm 50x50 mm' if 'Flat_Ha' in name else
                           DEFAULT_L if kind == 'flat' else None)
            image(f'calibration-masters/{name}.fit', kind, (1920, 1080), entry='calibration_master',
                  train_name=train_name, filter_name=filter_name)

    for name, train_name, filter_name in (
        ('Moon_2600MM_L', '设备1', DEFAULT_L),
        ('M31_G416000_L', '设备2', 'Astrodon Gen2 E-Series Tru-Balance Lum 50x50 mm'),
        ('M42_QHY600_L', '设备3', 'Astrodon Gen2 I-Series Tru-Balance Lum 50 mm'),
        ('Jupiter_UranusM_IR', '设备4', 'Astronomik ProPlanet 642 BP IR-Pass 1.25"'),
        ('Sun_ASI662MC', '设备5', None),
    ):
        relative = f'videos/{name}.mp4'
        path = root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), '-hide_banner', '-loglevel', 'error',
                        '-f', 'lavfi', '-i', 'testsrc2=size=1280x720:rate=10',
                        '-t', '10', '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
                        '-movflags', '+faststart', '-n', str(path)], check=True)
        manifest['files'].append({'path': relative, 'category': 'video', 'import_entry': 'video', 'width': 1280,
                                  'height': 720, 'duration_seconds': 10, 'fps': 10,
                                  'train_name': train_name, 'filter_name': filter_name})

    group = manifest["groups"][0]
    member = next(item for item in manifest["files"] if item["group"] == Path(group["path"]).name)
    duplicate = "edge-cases/same-name/" + Path(member["path"]).name
    image(duplicate, "same_name", (1920, 1080), entry="edge_case")
    addition = "edge-cases/append/Light_M31_Extra.fit"
    image(addition, "append", (1920, 1080), entry="edge_case")
    manifest["append_scenarios"] = {"collection": group["path"], "same_name": duplicate, "new_file": addition}
    (root / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Generated {len(manifest["files"])} synthetic files in {root}')


if __name__ == '__main__':
    main()
