export const values = {
  file_kind: ['image', 'video', 'other', 'unknown'],
  usage: ['light', 'dark', 'flat', 'bias', 'dark_flat', 'other', 'unknown'],
  role: ['raw', 'calibration_master', 'master_frame', 'processed'],
  calibration_state: ['uncalibrated', 'calibrated', 'unknown', 'not_applicable'],
  stage: ['raw', 'preprocessed', 'registered', 'stacked', 'mosaiced', 'postprocessed', 'finished', 'unknown'],
} as const;
export const numbers = ['exposure', 'gain', 'offset', 'temperature', 'order', 'fwhm', 'snr'] as const;
export const details = ['target', 'target_type', 'captured_at', 'filter', 'band', 'binning', 'panel', 'region', 'batch', 'channel', 'notes'] as const;
export const calibrationUsage = ['dark', 'flat', 'bias', 'dark_flat'] as const;
export const processingFields = ['usage', 'camera_id', 'optical_train_id', 'filter', 'band', 'exposure', 'gain', 'offset', 'binning', 'temperature'] as const;
