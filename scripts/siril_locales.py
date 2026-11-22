"""Sync native ComfyUI Chinese node and category messages with the Siril catalogue."""

import argparse
import json
from pathlib import Path

from extension.siril.command_presentation import GROUPS
from extension.siril.commands import COMMANDS

ROOT = Path(__file__).resolve().parents[1]
LOCALES = ROOT / "locales/zh"
INPUTS = {
    "arguments": {"name": "命令参数", "tooltip": "填写 JSON 参数数组，使用 {input} 引用文件路径端口。"},
    "stage_only": {"name": "仅暂存步骤", "tooltip": "生成会话步骤供下游使用，本节点此时不运行 CLI。"},
    "image_path": {"name": "图像路径", "tooltip": "命令执行前加载此文件。"},
    "file_path": {"name": "文件路径", "tooltip": "暂存此文件，并用 {input} 在参数中引用。"},
    "directory_path": {"name": "输入目录", "tooltip": "接入上游目录中的文件。"},
    "source_directory": {"name": "本地源目录", "tooltip": "宿主上的绝对目录路径，例如 FITS 序列所在目录。"},
    "previous_steps": {"name": "上游会话步骤", "tooltip": "连接前一节点暂存的会话步骤。"},
}
FITS_INPUTS = {
    "shadowsclip": {"name": "阴影裁剪 (σ)", "tooltip": "用标准差表示阴影裁剪。"},
    "targetbg": {"name": "目标背景", "tooltip": "0 到 1 的归一化目标背景。"},
    "linked": {"name": "联动 RGB 通道", "tooltip": "关闭联动可能改变白平衡。单色输入忽略此值。"},
    "sigma": {"name": "标准差", "tooltip": "以像素为单位的正数。"},
}


def localized_definitions():
    nodes = {}
    for command in COMMANDS.values():
        if not command.scriptable:
            continue
        if command.fits_preview:
            inputs = {"image_path": {"name": "FITS 路径"}}
            inputs.update({parameter.name: FITS_INPUTS[parameter.name] for parameter in command.parameters})
            outputs = {0: {"name": "结果 FITS 路径"}}
        else:
            inputs = {name: value for name, value in INPUTS.items()
                      if name != "image_path" or "image" in command.requires}
            outputs = dict(enumerate({"name": label} for label in ("结果图像路径", "结果目录", "CLI 日志", "会话步骤")))
        row = command.describe()
        nodes[command.node_id] = {
            "display_name": row["title_zh"], "description": row["description_zh"],
            "inputs": inputs, "outputs": {str(key): value for key, value in outputs.items()},
        }
    return nodes


def sync(check=False):
    path = LOCALES / "nodeDefs.json"
    source = json.loads(path.read_text(encoding="utf-8"))
    nodes = localized_definitions()
    other = {key: value for key, value in source.items() if not key.startswith("AstroPhotoSiril")}
    categories = {"Siril": "Siril"}
    for category, (zh, _) in GROUPS.items():
        segments = (segment.replace(".", "_") for segment in category.split("/"))
        categories.update(zip(segments, zh.split("/"), strict=True))
    expected = {**other, **nodes}
    if check and source != expected:
        return False
    if not check:
        path.write_text(json.dumps(expected, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for locale in ("en", "zh"):
        categories_path = LOCALES.parent / locale / "main.json"
        main = json.loads(categories_path.read_text(encoding="utf-8"))
        labels = {key: key if locale == "en" else label for key, label in categories.items()}
        existing = main.get("nodeCategories", {})
        if check:
            if any(existing.get(key) != value for key, value in labels.items()):
                return False
        else:
            main["nodeCategories"] = {**existing, **labels}
            categories_path.write_text(json.dumps(main, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    if not sync(parser.parse_args().check):
        raise SystemExit("Run python -m scripts.siril_locales to refresh the native locale resources")
