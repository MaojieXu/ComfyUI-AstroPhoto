"""Opt-in stable keyset pagination for named equipment collections."""

import base64
import hashlib
import json

from sqlalchemy import and_, func, or_, select

from ..core.errors import StorageError
from .schemas import invalid
from .service import name_key


def sorted_page(session, model, conditions, sort, cursor, limit, filters):
    session.connection().connection.driver_connection.create_function("ap_name_key", 1, name_key)
    column = {"name_asc": func.ap_name_key(model.name), "name_desc": func.ap_name_key(model.name),
              "created_desc": model.created_at_utc, "updated_desc": model.updated_at_utc}[sort]
    descending = sort != "name_asc"
    fingerprint = hashlib.sha256(json.dumps([model.__tablename__, sort, filters], ensure_ascii=False,
                                             sort_keys=True).encode()).hexdigest()
    if cursor:
        try:
            data = json.loads(base64.urlsafe_b64decode(cursor + "=" * (-len(cursor) % 4)))
            if (not isinstance(data, dict) or data.get("f") != fingerprint or
                    not isinstance(data.get("k"), str) or not isinstance(data.get("i"), str)):
                raise ValueError()
            key, item_id = data["k"], data["i"]
            from .schemas import id_value
            id_value(item_id, "after")
        except (ValueError, TypeError, UnicodeError, StorageError):
            invalid("after", "invalid_cursor")
        conditions = [*conditions, or_(column < key if descending else column > key,
                                       and_(column == key, model.id > item_id))]
    order = column.desc() if descending else column.asc()
    rows = list(session.scalars(select(model).where(*conditions).order_by(order, model.id.asc()).limit(limit + 1)))
    next_cursor = None
    if len(rows) > limit:
        last = rows[limit - 1]
        key = name_key(last.name) if sort.startswith("name_") else getattr(last, sort.replace("_desc", "_at_utc"))
        payload = json.dumps({"f": fingerprint, "k": key, "i": last.id}, ensure_ascii=False).encode()
        next_cursor = base64.urlsafe_b64encode(payload).decode().rstrip("=")
    return rows[:limit], next_cursor
