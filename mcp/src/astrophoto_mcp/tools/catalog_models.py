"""Public schema for typed library, calibration and project tools."""

from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, MISSING

AssetType = Literal["subframe_collection", "video", "master_frame", "image_result"]
FrameType = Literal["light", "dark", "flat", "bias", "dark_flat", "unknown"]
MasterType = Literal["dark", "bias", "flat", "dark_flat"]
CalibrationState = Literal["calibrated", "uncalibrated", "unknown"]
FilterState = Literal["selected", "none", "unknown"]
Sort = Literal["name_asc", "name_desc"]
DatedSort = Literal["name_asc", "name_desc", "created_desc", "updated_desc"]
Name = Annotated[str, Field(min_length=1, max_length=120, description="Display name, in the original language.")]
Path = Annotated[str, Field(min_length=1, description="Path on the ComfyUI host.")]
LogicalPath = Annotated[str, Field(pattern=r"^/", description="Logical project path; / is the project root.")]
Notes = Annotated[str, Field(min_length=1, max_length=4000)]
Limit = Annotated[int, Field(ge=1, le=100, description="Maximum number of results per page.")]
Cursor = Annotated[str, Field(max_length=8192, description="Cursor returned for the same listing and filters.")]
Reference = Annotated[str, Field(min_length=1, description="Exact reference returned by a tool; use only to disambiguate.")]
Number = Annotated[float, Field(allow_inf_nan=False)]
NonNegative = Annotated[float, Field(ge=0, allow_inf_nan=False)]
CaptureText = Annotated[str, Field(min_length=1, max_length=256)]


class Input(BaseModel):
    model_config = ConfigDict(extra="forbid")


class CollectionRef(Input):
    name: Name
    reference: Reference | None = None


class AssetRef(CollectionRef):
    asset_type: AssetType


class MasterAssetRef(CollectionRef):
    asset_type: Literal["master_frame"] = "master_frame"


class CalibrationRef(CollectionRef):
    master_type: MasterType | None = None


class CaptureFilters(Input):
    exposure_seconds: NonNegative | None = None
    iso: NonNegative | None = None
    gain: Number | None = None
    offset: Number | None = None
    binning: CaptureText | None = None
    readout_mode: CaptureText | None = None


class CaptureParameters(CaptureFilters):
    temperature_c: Number | None = Field(default=None, description="Recorded temperature in degrees Celsius.")


class EquipmentBinding(Input):
    equipment_group: Name | None = None
    filter_state: FilterState | MISSING = MISSING
    filter_name: Name | None = None


class ProjectAssetInput(Input):
    name: Name
    alias: Name | None = None
