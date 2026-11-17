"""Opt-in real host verification. Never starts or changes a ComfyUI install."""

import os
from urllib.request import urlopen
import json

import pytest


@pytest.mark.host
def test_running_comfyui_status_and_node():
    base = os.environ.get("COMFYUI_TEST_URL")
    if not base:
        pytest.skip("Set COMFYUI_TEST_URL to opt in to real host verification")
    def get(path):
        with urlopen(base.rstrip("/") + "/" + path, timeout=10) as response:
            return json.load(response)
    status = get("astrophoto/v1/status")
    assert status["status"] == "ok"
    assert status["capabilities"]["drawing_node"]["available"]
    node = get("object_info/vue-basic")["vue-basic"]
    assert node["input"]["required"]["custom_vue_component_basic"][0] == "CUSTOM_VUE_COMPONENT_BASIC"
    assert node["output"] == ["IMAGE"]
