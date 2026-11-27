from astrophoto.bootstrap import bootstrap
from astrophoto.core.config import AppConfig
from astrophoto.api.status import status_payload


def test_capabilities_follow_registration_not_plans(tmp_path):
    live = {"registered": False}
    runtime = bootstrap(lambda: live["registered"], AppConfig("ComfyUI_AstroPhoto", "0.0.1", tmp_path))
    first = status_payload(runtime)
    assert first["status"] == "degraded"
    assert not first["capabilities"]["drawing_node"]["available"]
    runtime.routes_registered = True
    live["registered"] = True
    result = status_payload(runtime)
    assert result["status"] == "ok"
    assert result["extension"] == {"id": "ComfyUI_AstroPhoto", "version": "0.0.1"}
    assert result["api_version"] == "v1"
    assert result["capabilities"]["status_api"]["available"]
    for name in ("storage", "assets", "software", "processing", "knowledge", "memory", "experiments"):
        assert result["capabilities"][name] == {"available": False, "reason": "not_implemented"}
    assert result["capabilities"]["canvas_bridge"] == {"available": False, "reason": "local_storage_disabled"}
    runtime.trusted_local = True
    assert status_payload(runtime)["capabilities"]["canvas_bridge"] == {"available": True, "reason": None}
    live["registered"] = False
    assert status_payload(runtime)["status"] == "degraded"
