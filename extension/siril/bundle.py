"""Siril's contributions to AstroPhoto's native host extension."""

from .previews import PreviewService
from .processing import recover_runs
from .routes import siril_routes
from .software import SoftwareService


class SirilBundle:
    def initialize_storage(self, storage) -> None:
        self.software = SoftwareService(storage)
        self.previews = PreviewService(storage, self.software)
        recover_runs(storage)

    def processing_state(self) -> str:
        return self.software.status()["state"]

    def routes(self):
        return siril_routes(self)

    @staticmethod
    def node_types():
        from .node import AstroPhotoSirilAutoStretch

        return (AstroPhotoSirilAutoStretch,)
