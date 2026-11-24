import pytest

from astrophoto.assets.library_rules import properties
from astrophoto.core.errors import StorageError


def test_iso_and_readout_mode_are_separate_optional_capture_properties():
    assert properties({"iso": 800, "gain": 100, "readout_mode": "High Gain"}) == {
        "iso": 800, "gain": 100, "readout_mode": "High Gain"
    }
    assert properties({"iso": None, "readout_mode": None}) == {"iso": None, "readout_mode": None}


@pytest.mark.parametrize("value", [-1, float("nan"), True, "800"])
def test_invalid_iso_is_rejected(value):
    with pytest.raises(StorageError):
        properties({"iso": value})
