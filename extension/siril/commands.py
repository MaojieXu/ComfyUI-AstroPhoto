"""AstroPhoto node and execution contracts for the versioned Siril command table."""

from dataclasses import dataclass
import math

from ._dependencies import errors
from .command_presentation import GROUPS, PRESENTATION, SEARCH_ALIASES, SEQUENCE_VARIANTS
from .command_table import COMMAND_TABLE
from .software import VERSION


@dataclass(frozen=True)
class Parameter:
    name: str
    label: str
    default: float | bool
    help: str
    minimum: float | None = None
    maximum: float | None = None
    rgb_only: bool = False

    def describe(self):
        return {
            "name": self.name, "label": self.label, "default": self.default,
            "help": self.help, "min": self.minimum, "max": self.maximum,
            "rgb_only": self.rgb_only,
        }


@dataclass(frozen=True)
class Command:
    name: str
    minimum_args: int
    usage: str
    scriptable: bool
    requires: tuple[str, ...]
    build_feature: str

    @property
    def node_id(self):
        if self.name == "autostretch":
            return "AstroPhotoSirilAutoStretch"
        if self.name == "gauss":
            return "AstroPhotoSirilGaussianBlur"
        if self.name == "neg":
            return "AstroPhotoSirilNegative"
        return f"AstroPhotoSiril_{self.name}"

    @property
    def title(self):
        return PRESENTATION[self.name][1]

    @property
    def description(self):
        return PRESENTATION[self.name][3]

    @property
    def category(self):
        return f"AstroPhoto/Siril/{PRESENTATION[self.name][0]}"

    @property
    def search_aliases(self):
        _, title, title_zh, _, _ = PRESENTATION[self.name]
        base = SEQUENCE_VARIANTS.get(self.name, self.name)
        return list(dict.fromkeys((self.name, title, title_zh, *SEARCH_ALIASES.get(base, ()))))

    @property
    def parameters(self):
        return FITS_PARAMETERS.get(self.name, ())

    @property
    def fits_preview(self):
        return self.name in FITS_PARAMETERS

    @property
    def producer(self):
        return "siril-autostretch-v1" if self.name == "autostretch" else "siril-single-fits-v1"

    @property
    def output_filename(self):
        return "stretched.fit" if self.name == "autostretch" else "result.fit"

    def values(self, values, channels):
        code = "INVALID_AUTOSTRETCH_PARAMETERS" if self.name == "autostretch" else "INVALID_SIRIL_PARAMETERS"
        if set(values) != {field.name for field in self.parameters}:
            raise errors.StorageError(code)
        normalized = {}
        for field in self.parameters:
            value = values[field.name]
            if type(field.default) is bool:
                if type(value) is not bool:
                    raise errors.StorageError(code)
                normalized[field.name] = value and (channels == 3 or not field.rgb_only)
                continue
            try:
                numeric = type(value) in (int, float) and math.isfinite(value)
            except OverflowError:
                numeric = False
            if (not numeric or field.minimum is not None and value < field.minimum
                    or field.maximum is not None and value > field.maximum
                    or field.name == "sigma" and value == 0):
                raise errors.StorageError(code)
            normalized[field.name] = float(value)
        return normalized

    def arguments(self, params):
        if self.name == "autostretch":
            linked = ("-linked",) if params["linked"] else ()
            return (*linked, params["shadowsclip"], params["targetbg"])
        return tuple(params[field.name] for field in self.parameters)

    def describe(self):
        requirements = [{"image": "current image", "sequence": "current sequence",
                         "rgb": "RGB", "mono": "monochrome", "cfa": "CFA"}[key] for key in self.requires]
        if self.name.startswith("seq") or self.name in {"stack", "register", "calibrate", "light_curve", "merge"}:
            if "current sequence" not in requirements:
                requirements.append("sequence files")
        if self.name in FILE_INPUTS:
            requirements.append("input file path")
        if self.name in {"starnet", "seqstarnet"}:
            requirements.append("configured StarNet executable")
        if self.name in {"platesolve", "seqplatesolve", "pcc", "spcc", "catsearch", "catquery",
                         "conesearch", "findcompstars"}:
            requirements.append("catalogue access")
        if self.name == "pyscript":
            requirements.append("host-configured Python script file")
        category, _, title_zh, _, description_zh = PRESENTATION[self.name]
        return {
            "category": self.category, "category_zh": GROUPS[category][0],
            "title_zh": title_zh, "description_zh": description_zh,
            "id": self.name, "usage": self.usage, "scriptable": self.scriptable,
            "requires": requirements, "build_feature": self.build_feature or None,
            "node_id": self.node_id if self.scriptable else None,
            "title": self.title, "description": self.description,
            "search_aliases": self.search_aliases,
            "preview": self.fits_preview, "parameters": [p.describe() for p in self.parameters],
        }


FILE_INPUTS = {
    "addwcs", "calibrate", "calibrate_single", "cosme", "cosme_cfa", "epf", "fdiv", "ffti", "iadd", "icc_assign",
    "icc_convert_to", "idiv", "imul", "isub", "jsonmetadata", "linear_match", "livestack", "load", "load_seq",
    "makepsf", "merge_cfa", "mirrorx_single", "pyscript", "rgbcomp", "rl", "sb", "seqcosme", "seqcosme_cfa",
    "seqrl", "seqsb", "seqwiener", "start_ls", "unpurple", "wiener",
}
FITS_PARAMETERS = {
    "autostretch": (
        Parameter("shadowsclip", "Shadows clip (σ)", -2.8, "Shadows clipping in standard deviations."),
        Parameter("targetbg", "Target background", 0.25, "Target normalized background, from 0 to 1.", 0, 1),
        Parameter("linked", "Link RGB channels", True, "Unlinked color stretching can alter white balance. Ignored for mono.",
                  rgb_only=True),
    ),
    "gauss": (
        Parameter("sigma", "Sigma", 1.0, "Positive Gaussian radius in pixels.", 0),
    ),
    "neg": (),
}
COMMANDS = {row[0]: Command(*row) for row in COMMAND_TABLE}
AUTOSTRETCH = COMMANDS["autostretch"]


def command_for(name):
    command = COMMANDS.get(name)
    if command is None or not command.scriptable:
        raise errors.StorageError("SIRIL_COMMAND_NOT_AVAILABLE")
    return command


def catalogue():
    return {"version": VERSION, "commands": [command.describe() for command in COMMANDS.values()]}
