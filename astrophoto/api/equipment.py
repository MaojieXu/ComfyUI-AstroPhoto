"""Native aiohttp routes for equipment and optical trains."""

from ..core.errors import StorageError
from ..equipment.schemas import id_value, list_options, object_fields


def entity_id(request):
    return id_value(request.match_info["id"])


def list_equipment(service, _runtime, request, _body):
    return service.equipment.list_equipment(**list_options(request.query))


def get_equipment(service, _runtime, request, _body):
    return service.equipment.get_equipment(entity_id(request))


def create_equipment(service, _runtime, _request, body):
    return service.equipment.create_equipment(body)


def update_equipment(service, _runtime, request, body):
    return service.equipment.update_equipment(entity_id(request), body)


def archive(domain, archived):
    def action(service, _runtime, request, body):
        object_fields(body, ("expected_version",), ("expected_version",))
        return getattr(service, domain).set_archived(entity_id(request), body["expected_version"], archived)
    return action


def delete_equipment(service, _runtime, request, body):
    object_fields(body, ("expected_version",), ("expected_version",))
    service.equipment.delete_unused_equipment(entity_id(request), body["expected_version"])


def list_trains(service, _runtime, request, _body):
    return service.optical_trains.list_trains(**list_options(request.query, trains=True))


def create_train(service, _runtime, _request, body):
    return service.optical_trains.create_train(body)


def get_train(service, _runtime, request, _body):
    return service.optical_trains.get_train(entity_id(request))


def delete_train(service, _runtime, request, body):
    object_fields(body, ("expected_version",), ("expected_version",))
    service.optical_trains.delete_train(entity_id(request), body["expected_version"])


def get_draft(service, _runtime, request, _body):
    return {"draft": service.optical_trains.get_draft(entity_id(request))}


def save_draft(service, _runtime, request, body):
    return service.optical_trains.save_draft(entity_id(request), body)


def list_revisions(service, _runtime, request, _body):
    return service.optical_trains.list_revisions(entity_id(request))


def get_revision(service, _runtime, request, _body):
    return service.optical_trains.get_revision(entity_id(request), id_value(request.match_info["revision_id"], "revision_id"))


def legacy_revision_write(_service, _runtime, _request, _body):
    raise StorageError("TRAIN_HISTORY_READ_ONLY")


def immutable_revision(service, _runtime, request, _body):
    get_revision(service, _runtime, request, _body)
    raise StorageError("REVISION_IMMUTABLE")


def equipment_routes():
    return [
        ("GET", "/equipment", list_equipment, 200),
        ("GET", "/equipment/{id}", get_equipment, 200),
        ("POST", "/equipment", create_equipment, 201),
        ("PATCH", "/equipment/{id}", update_equipment, 200),
        ("DELETE", "/equipment/{id}", delete_equipment, 204),
        ("POST", "/equipment/{id}/archive", archive("equipment", True), 200),
        ("POST", "/equipment/{id}/restore", archive("equipment", False), 200),
        ("GET", "/optical-trains", list_trains, 200),
        ("POST", "/optical-trains", create_train, 201),
        ("GET", "/optical-trains/{id}", get_train, 200),
        ("DELETE", "/optical-trains/{id}", delete_train, 204),
        ("GET", "/optical-trains/{id}/draft", get_draft, 200),
        ("PUT", "/optical-trains/{id}/draft", save_draft, 200),
        ("GET", "/optical-trains/{id}/revisions", list_revisions, 200),
        ("POST", "/optical-trains/{id}/revisions", legacy_revision_write, 410),
        ("GET", "/optical-trains/{id}/revisions/{revision_id}", get_revision, 200),
        ("PATCH", "/optical-trains/{id}/revisions/{revision_id}", immutable_revision, 409),
        ("DELETE", "/optical-trains/{id}/revisions/{revision_id}", immutable_revision, 409),
        ("PUT", "/optical-trains/{id}/default-revision", legacy_revision_write, 410),
        ("POST", "/optical-trains/{id}/archive", archive("optical_trains", True), 200),
        ("POST", "/optical-trains/{id}/restore", archive("optical_trains", False), 200),
    ]
