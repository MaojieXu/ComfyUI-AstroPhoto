"""Contributions an optional processing bundle provides to the host."""

from __future__ import annotations

from collections.abc import Callable, Sequence
from typing import TYPE_CHECKING, Protocol

if TYPE_CHECKING:
    from ..nodes.scientific import ScientificNode
    from .storage.runtime import StorageRuntime

Route = tuple[str, str, Callable, int]


class ProcessingBundle(Protocol):
    def initialize_storage(self, storage: StorageRuntime) -> None: ...

    def routes(self) -> Sequence[Route]: ...

    def node_types(self) -> Sequence[type[ScientificNode]]: ...

    def processing_state(self) -> str: ...
