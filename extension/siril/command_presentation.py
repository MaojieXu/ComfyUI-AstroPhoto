"""Bilingual command names and introductions, grouped by their primary Siril operation."""

GROUPS = {
    "Files, Sequences and Metadata": ("文件、序列与元数据", """
close|Close Image|关闭图像|Close the current image or sequence and release it from memory.|关闭当前图像或序列并释放内存。
convert|Convert Images to Sequence|转换为图像序列|Convert supported input files into a Siril sequence, with optional debayering.|把支持的文件转换成 Siril 序列，可同时进行去马赛克。
convertraw|Convert Camera RAW|转换相机 RAW|Convert supported camera RAW files into a Siril sequence.|将支持的相机 RAW 文件转换成 Siril 序列。
dumpheader|Read FITS Header|读取 FITS 头|Print the header keywords of the current FITS image.|输出当前 FITS 图像的头关键字。
jsonmetadata|Export Metadata as JSON|导出 JSON 元数据|Write FITS metadata and optional image statistics to JSON.|将 FITS 元数据和可选的图像统计量写入 JSON。
link|Link Images into Sequence|链接文件为序列|Build a sequence from existing files by linking or copying them.|通过链接或复制已有文件建立序列。
load|Load Image|加载图像|Open an image file as the current image.|打开文件，将其设为当前图像。
load_seq|Load Sequence|加载序列|Open a named image sequence in Siril.|在 Siril 中打开指定的图像序列。
merge|Merge Sequences|合并序列|Combine two or more sequences into one output sequence.|将两个或更多序列合并成一个输出序列。
new|Create Blank Image|创建空白图像|Create a zero-filled image with specified dimensions and channel count.|创建指定尺寸和通道数量的零值图像。
save|Save FITS|保存 FITS|Write the loaded image to a FITS file, optionally with checksums.|将当前图像写入 FITS，可同时写入校验和。
savebmp|Export BMP|导出 BMP|Write the current image to a BMP file.|将当前图像导出为 BMP。
savejpg|Export JPEG|导出 JPEG|Write a JPEG with optional quality settings.|导出 JPEG，可指定压缩质量。
savejxl|Export JPEG XL|导出 JPEG XL|Write a JPEG XL with selectable quality, effort and bit depth.|导出 JPEG XL，可设置质量、压缩强度和位深。
savepng|Export PNG|导出 PNG|Write the current image to a PNG file.|将当前图像导出为 PNG。
savepnm|Export PNM|导出 PNM|Write the current image in portable anymap format.|将当前图像导出为 PNM。
savetif|Export 16-bit TIFF|导出 16 位 TIFF|Write a TIFF with optional astronomical metadata and compression.|导出 16 位 TIFF，可包含天文元数据并启用压缩。
savetif32|Export 32-bit TIFF|导出 32 位 TIFF|Write a 32-bit TIFF of the current image.|以 32 位 TIFF 导出当前图像。
savetif8|Export 8-bit TIFF|导出 8 位 TIFF|Write an 8-bit TIFF of the current image.|以 8 位 TIFF 导出当前图像。
select|Include Sequence Frames|纳入序列帧|Mark a contiguous range of frames as selected.|将指定范围内的序列帧标记为已选。
seqclean|Clear Sequence State|清理序列状态|Clear saved registration, statistics or selection data for a sequence.|清除序列已保存的配准、统计或选帧数据。
seqheader|Export Sequence Headers|导出序列头关键字|Read selected FITS keywords across a sequence and optionally write a CSV.|读取序列各帧的指定 FITS 关键字，可导出 CSV。
sequpdate_key|Edit Sequence Keywords|批量编辑序列关键字|Apply a FITS header change across frames in a sequence.|将 FITS 头修改应用于序列中的各帧。
setcompress|Configure FITS Compression|设置 FITS 压缩|Set whether and how subsequent FITS files are compressed.|设置后续 FITS 文件是否压缩以及压缩方式。
setext|Set FITS Extension|设置 FITS 扩展名|Set the FITS filename extension used in the session.|设置当前会话所用的 FITS 文件扩展名。
unselect|Exclude Sequence Frames|排除序列帧|Deselect a contiguous range of frames.|取消选择指定范围内的序列帧。
update_key|Edit FITS Keyword|编辑 FITS 关键字|Add, rename, remove or annotate a FITS header keyword.|添加、重命名、删除或注释 FITS 头关键字。
"""),
    "Sensor Correction": ("传感器校正", """
calibrate|Calibrate Sequence|校准序列|Apply bias, dark and flat calibration to the frames of a sequence.|使用偏置场、暗场和平场校准序列帧。
calibrate_single|Calibrate Image|校准单张图像|Calibrate a single image with bias, dark and flat inputs.|使用偏置场、暗场和平场校准单张图像。
cosme|Correct Bad Pixels|修正坏像素|Correct the pixels listed in a supplied bad-pixel map.|按提供的坏像素映射表修正指定像素。
cosme_cfa|Correct CFA Bad Pixels|修正 CFA 坏像素|Repair listed bad pixels while respecting the sensor mosaic.|依据传感器彩色滤光阵列修正表中坏像素。
find_cosme|Detect and Correct Bad Pixels|检测并修正坏像素|Detect hot and cold pixels using sigma thresholds and repair them.|用标准差阈值检测并修正过亮和过暗的坏像素。
find_cosme_cfa|Detect and Correct CFA Bad Pixels|检测并修正 CFA 坏像素|Detect and repair hot and cold pixels in a mosaic image.|检测并修正彩色滤光阵列图像中的过亮和过暗坏像素。
find_hot|Export Bad-pixel Map|导出坏像素图|Detect hot and cold pixels and save their coordinates for later correction.|检测过亮和过暗的坏像素，保存其坐标供后续修正。
fix_xtrans|Correct X-Trans Artifacts|修正 X-Trans 伪影|Correct the autofocus-related pattern in X-Trans calibration frames.|修正 X-Trans 校准帧中的自动对焦区域伪影。
grey_flat|Equalize CFA Flat Channels|均衡 CFA 平场通道|Balance the mean intensities of the color channels in a CFA flat.|均衡 CFA 平场各颜色通道的平均亮度。
"""),
    "Geometry and Resampling": ("几何变换与重采样", """
binxy|Bin Pixels|像素合并|Combine square groups of pixels by averaging or summing their values.|按方形块合并像素，可计算平均值或总和。
boxselect|Select Image Region|选择图像区域|Set, inspect or clear a rectangular region for subsequent commands.|设置、查看或清除供后续命令使用的矩形区域。
crop|Crop Image|裁剪图像|Keep a rectangular region of the current image.|保留当前图像的指定矩形区域。
mirrorx|Flip Top to Bottom|上下翻转|Flip the current image vertically, optionally only if needed for bottom-up row order.|上下翻转当前图像，可限定为需要调整到底行优先时才翻转。
mirrorx_single|Normalize FITS Row Order|规范 FITS 行序|Flip the specified image file if its row order requires it.|当指定图像文件的行序需要调整时上下翻转。
mirrory|Flip Left to Right|左右翻转|Flip the current image horizontally.|左右翻转当前图像。
resample|Resample Image|重采样图像|Resize the image using a scale factor or a target dimension and interpolation.|按缩放倍率或目标尺寸插值重采样当前图像。
rotate|Rotate Image|旋转图像|Rotate the image by the specified angle using the selected interpolation.|按指定角度和插值方式旋转当前图像。
rotatePi|Rotate 180°|旋转 180°|Rotate the image by half a turn.|将当前图像旋转半周。
"""),
    "Image Registration": ("图像配准", """
getref|Inspect Reference Frame|查看参考帧|Report the current reference frame for the named sequence.|输出指定序列当前参考帧的信息。
register|Register Sequence|配准序列|Align the frames of a sequence to a reference frame.|将序列各帧与参考帧对齐。
seqapplyreg|Apply Sequence Registration|应用序列配准|Use existing registration data to transform the sequence frames.|利用已有配准数据变换序列帧。
setref|Set Reference Frame|指定参考帧|Choose the reference frame that a sequence should use.|指定序列应使用的参考帧。
"""),
    "Image Stacking": ("图像叠加", """
livestack|Add Live Stack Frame|加入实时叠加帧|Add a file to an active live stack.|将指定文件加入正在进行的实时叠加。
stack|Stack Sequence|叠加序列|Combine sequence frames into an integrated image using the chosen stacking method.|按所选叠加方法将序列帧合成为一张图像。
stackall|Stack All Sequences|叠加全部序列|Stack each sequence in the current directory.|逐个叠加当前目录中的序列。
start_ls|Start Live Stacking|启动实时叠加|Initialize a live stack, with optional dark and flat calibration.|初始化实时叠加，可同时配置暗场和平场校准。
stop_ls|Finish Live Stacking|结束实时叠加|Stop the active live stacking session.|结束当前实时叠加会话。
"""),
    "Tone and Contrast": ("亮度与对比度", """
asinh|Asinh Stretch|反双曲正弦拉伸|Stretch faint signals with an inverse hyperbolic sine curve.|用反双曲正弦曲线提升暗弱信号的可见度。
autoghs|Automatic Hyperbolic Stretch|自动双曲拉伸|Estimate a symmetry point from background statistics and apply a generalized hyperbolic stretch.|根据背景统计估计对称点并应用广义双曲拉伸。
autostretch|AutoStretch|自动拉伸|Calculate and apply a nonlinear background stretch to reveal faint detail.|根据背景自动计算非线性拉伸，显示暗弱细节。
clahe|Local Contrast (CLAHE)|局部对比度（CLAHE）|Enhance local contrast with contrast-limited adaptive histogram equalization.|用限制对比度的自适应直方图均衡增强局部对比度。
ddp|Digital Development|数字显影|Apply a digital-development tone curve to reveal detail across brightness levels.|用数字显影曲线呈现不同亮度层次的细节。
ght|Generalized Hyperbolic Stretch|广义双曲拉伸|Stretch around a configurable symmetry point while protecting selected shadows and highlights.|围绕可设置的对称点拉伸，可保护指定的阴影和高光。
invght|Inverse Hyperbolic Stretch|反向广义双曲拉伸|Apply the inverse generalized hyperbolic transformation.|应用广义双曲变换的逆变换。
invmodasinh|Inverse Modified Asinh|反向改进反双曲正弦拉伸|Apply the inverse of the modified asinh stretch.|应用改进反双曲正弦拉伸的逆变换。
invmtf|Inverse Midtones Transfer|反向中间调变换|Apply the inverse of the midtones transfer function.|应用中间调传递函数的逆变换。
linear_match|Match Reference Intensity|匹配参考亮度|Fit a linear intensity correction against a reference within a chosen range.|在指定范围内拟合线性亮度校正以匹配参考图像。
linstretch|Linear Stretch|线性拉伸|Adjust tonal range with a linear transform based on a chosen black point.|以指定黑点为基准线性调整色调范围。
log|Logarithmic Stretch|对数拉伸|Apply a logarithmic tone transformation to the image.|对当前图像应用对数色调变换。
modasinh|Modified Asinh Stretch|改进反双曲正弦拉伸|Apply a tunable asinh stretch with shadow and highlight protection.|应用可调节的反双曲正弦拉伸，并设置阴影和高光保护。
mtf|Midtones Transfer|中间调变换|Adjust black, white and midtone levels with a midtones transfer curve.|用中间调传递曲线调整黑点、白点和中间调。
neg|Negative|反相|Invert the current image pixel values.|反转当前图像的像素值。
"""),
    "Color and Channels/Color Calibration": ("色彩与通道/色彩校准", """
ccm|Apply Color Matrix|应用颜色校正矩阵|Transform RGB values using a 3×3 color correction matrix.|用 3×3 颜色校正矩阵变换 RGB 数值。
pcc|Photometric Color Calibration|测光色彩校准|Calibrate the colors of a plate-solved image against catalogued stars.|利用星表中的恒星校准已完成天文定位的图像色彩。
spcc|Spectrophotometric Color Calibration|分光测光色彩校准|Calibrate image colors using stellar spectra and the camera or filter response.|依据恒星光谱和相机或滤镜响应校准图像色彩。
spcc_list|List SPCC References|列出 SPCC 参考项|List the sensors, filters or white references available to SPCC.|列出 SPCC 可用的传感器、滤镜或白参考。
"""),
    "Color and Channels/Color Management": ("色彩与通道/色彩管理", """
icc_assign|Assign ICC Profile|指定 ICC 色彩配置|Attach a color profile without converting the pixel values.|指定 ICC 色彩配置文件，同时保留像素值。
icc_convert_to|Convert ICC Profile|转换 ICC 色彩配置|Convert the image colors into the chosen ICC color space.|将图像颜色转换到指定的 ICC 色彩空间。
icc_remove|Remove ICC Profile|移除 ICC 色彩配置|Remove the embedded ICC color profile from the image.|移除图像嵌入的 ICC 色彩配置文件。
"""),
    "Color and Channels/Color Adjustments": ("色彩与通道/色彩调整", """
rmgreen|Reduce Green Cast (SCNR)|抑制绿色偏色（SCNR）|Reduce excess green using the selected neutralization method.|按所选中和方法减少多余的绿色成分。
satu|Adjust Saturation|调整饱和度|Change color saturation with optional background and hue-range controls.|调整色彩饱和度，可指定背景参数和色相范围。
"""),
    "Color and Channels/Channel Management": ("色彩与通道/通道管理", """
extract_Green|Extract CFA Green|提取 CFA 绿色信号|Extract the averaged green signal from the CFA mosaic.|从彩色滤光阵列提取平均后的绿色信号。
extract_Ha|Extract H-alpha|提取 Hα|Extract the red-filter H-alpha signal from a suitable CFA image.|从适用的 CFA 图像中提取红色滤镜采集的 Hα 信号。
extract_HaOIII|Extract H-alpha and O III|提取 Hα 和 O III|Separate H-alpha and O III signals captured by a suitable dual-band CFA image.|从适用的双窄带 CFA 图像中分离 Hα 和 O III 信号。
merge_cfa|Merge CFA Planes|合并 CFA 平面|Reassemble four separate CFA planes into a mosaic using the selected Bayer pattern.|按所选拜耳模式将四个 CFA 平面重组为马赛克图像。
rgbcomp|Compose RGB Image|合成 RGB 图像|Combine separate channel images into a color image.|将分离的通道图像合成为彩色图像。
seqmerge_cfa|Merge CFA Plane Sequences|合并 CFA 平面序列|Reassemble four matching sequences into one CFA mosaic sequence.|将四组对应的平面序列合并为一个 CFA 马赛克序列。
split|Split Color Channels|拆分颜色通道|Export the color components of an image in the chosen color model.|按所选色彩模型导出图像的各个颜色分量。
split_cfa|Split CFA Planes|拆分 CFA 平面|Separate the four pixel positions of a CFA mosaic into individual images.|把 CFA 马赛克的四种像素位置拆成独立图像。
"""),
    "Background Extraction and Gradient Correction": ("背景提取与梯度校正", """
subsky|Extract Background|背景提取|Model and remove large-scale background gradients.|拟合并移除大尺度背景梯度。
"""),
    "Artifact Correction": ("伪影校正", """
fixbanding|Remove Banding|去除条带|Reduce regular row or column banding in an image.|减弱图像中沿行或列的条带噪声。
unpurple|Reduce Purple Fringing|抑制紫边|Reduce purple halos around stars, with optional masking.|减少恒星周围的紫色边缘，可用掩膜限制作用范围。
"""),
    "Convolution and Sharpening": ("卷积与锐化", """
gauss|Gaussian Blur|高斯模糊|Smooth the image with a Gaussian kernel whose width is set by sigma.|用高斯核平滑图像，核宽度由标准差决定。
rgradient|Radial Gradient Filter|径向梯度滤波|Highlight structure around a chosen center using a rotational gradient.|围绕指定中心使用旋转梯度增强局部结构。
unsharp|Unsharp Mask|反锐化遮罩|Sharpen detail by blending the image with a Gaussian-blurred copy.|将图像与高斯模糊副本进行混合，以增强细节锐度。
"""),
    "Deconvolution": ("反卷积", """
makepsf|Build Deconvolution PSF|构建反卷积 PSF|Create, load, save or clear a point spread function for deconvolution.|创建、加载、保存或清除用于反卷积的点扩散函数。
rl|Richardson–Lucy Deconvolution|Richardson–Lucy 反卷积|Recover detail using iterative Richardson–Lucy deconvolution.|用 Richardson–Lucy 迭代反卷积恢复细节。
sb|Split Bregman Deconvolution|Split Bregman 反卷积|Recover detail with a Split Bregman deconvolution solver.|用 Split Bregman 反卷积求解方法恢复细节。
wiener|Wiener Deconvolution|维纳反卷积|Reduce blur with Wiener deconvolution using a point spread function.|根据点扩散函数用维纳反卷积减轻模糊。
"""),
    "Noise Reduction": ("降噪", """
denoise|Reduce Noise|降噪|Apply non-local Bayesian denoising with optional enhancement stages.|应用非局部贝叶斯降噪，可启用额外增强步骤。
epf|Edge-preserving Filter|保边滤波|Smooth the image while preserving edges, optionally using a guide image.|平滑图像时保留边缘，可提供引导图像。
fmedian|Median Filter|中值滤波|Reduce isolated noise with an adjustable median filter.|用可调节的中值滤波器减少孤立噪点。
"""),
    "Multiscale Processing": ("多尺度处理", """
extract|Extract Wavelet Layers|提取小波层|Export the requested number of wavelet decomposition layers.|导出指定数量的小波分解层。
wavelet|Wavelet Decomposition|小波分解|Decompose the image into layers at different spatial scales.|将图像分解为不同空间尺度的小波层。
wrecons|Recombine Wavelet Layers|重组小波层|Reconstruct an image from wavelet layers using individual weights.|使用分层权重将小波层重新组合为图像。
"""),
    "Feature Detection and Processing": ("特征检测与处理", """
clearstar|Clear Detected Stars|清除星点检测|Clear the current detected-star list.|清除当前的检测星点列表。
findstar|Detect Stars|检测星点|Detect stars in the current frame and optionally export the detections.|检测当前图像中的星点，可导出检测结果。
setfindstar|Configure Star Detection|设置星点检测|Adjust the radius and thresholds used by the star detector.|调整星点检测所用的半径、阈值及其他条件。
starnet|Remove Stars (StarNet)|移除星点（StarNet）|Separate stars from background structures using a configured StarNet executable.|使用已配置的 StarNet 将星点与背景结构分离。
synthstar|Synthesize Stars|合成星点|Create a synthetic star image from measured star profiles.|根据实测星点轮廓生成合成星点图像。
unclipstars|Repair Clipped Stars|修复饱和星点|Reprofile clipped stars to improve the appearance of saturated cores.|重建饱和星点的轮廓，改善截断的星核。
"""),
    "Pixel and Frequency-Domain Operations": ("像素与频域运算", """
addmax|Combine Pixel Maxima|按像素取最大值|Combine two images by keeping the greater value at each pixel position.|逐像素比较两张图像，并保留较大值。
fdiv|Divide by Reference Image|除以参考图像|Divide by the supplied image and apply a scalar multiplier to the result.|除以提供的参考图像，再对结果乘以指定系数。
ffill|Fill with Float Value|用浮点值填充|Fill the image or selected rectangle with a floating-point intensity.|用浮点亮度值填充图像或指定矩形。
fftd|Forward Fourier Transform|正向傅里叶变换|Write the Fourier magnitude and phase of the current image.|输出当前图像的傅里叶幅度和相位。
ffti|Inverse Fourier Transform|逆傅里叶变换|Reconstruct a spatial image from Fourier magnitude and phase images.|从傅里叶幅度图和相位图重建空间图像。
fill|Fill with ADU Value|用 ADU 值填充|Fill the image or selection with the specified ADU intensity.|用指定的 ADU 亮度填充图像或选区。
fmul|Multiply by Scalar|乘以常数|Multiply every image pixel by a constant factor.|将图像所有像素乘以一个常数。
iadd|Add Images|图像相加|Add matching pixels from a second image.|将第二张图像的对应像素相加。
idiv|Divide Images|图像相除|Divide by the corresponding pixels in a second image.|用第二张图像的对应像素做除法。
imul|Multiply Images|图像相乘|Multiply by matching pixels from a second image.|将两张图像的对应像素相乘。
isub|Subtract Images|图像相减|Subtract matching pixels from a second image.|从当前图像中减去第二张图像的对应像素。
limit|Limit Pixel Range|限制像素范围|Clip or rescale values into the supported pixel range.|通过裁剪或重缩放将数值限制在支持的像素范围。
nozero|Replace Zero Pixels|替换零值像素|Replace zero-valued pixels with a supplied level before operations such as division.|用指定数值替换零值像素，便于后续执行除法等操作。
offset|Add Pixel Offset|添加像素偏移|Add a constant ADU offset to the image.|向各像素添加固定的 ADU 偏移值。
pm|Pixel Math Expression|像素数学表达式|Evaluate an expression over image pixels to produce a new result.|对图像像素计算表达式并生成结果。
thresh|Clamp Pixel Thresholds|限制像素上下阈值|Apply both lower and upper thresholds to image pixels.|同时对图像应用下限和上限阈值。
threshhi|Clamp Upper Threshold|限制上阈值|Lower pixels above the chosen threshold to that threshold.|将高于阈值的像素降低到该阈值。
threshlo|Clamp Lower Threshold|限制下阈值|Raise pixels below the chosen threshold to that threshold.|将低于阈值的像素提高到该阈值。
"""),
    "Image Measurement and Analysis": ("图像测量与分析", """
bg|Measure Background|测量背景|Report the background level of the loaded image.|输出当前图像的背景亮度。
bgnoise|Measure Background Noise|测量背景噪声|Estimate the noise level of the current image background.|估计当前图像的背景噪声水平。
cdg|Measure Image Centroid|测量图像重心|Calculate the brightness centroid from sufficiently bright connected pixels.|根据亮度足够的相邻像素计算图像亮度重心。
entropy|Measure Entropy|测量图像熵|Calculate the entropy of the loaded image.|计算当前图像的信息熵。
findcompstars|Find Comparison Stars|寻找比较星|Find suitable catalogue comparison stars for photometry and optionally export them.|在星表中寻找适合测光的比较星，可导出结果。
histo|Export Histogram|导出直方图|Compute and write a histogram for the selected channel.|计算并导出所选通道的直方图。
inspector|Inspect Image Tiles|检查图像分区|Show a tile mosaic for comparing the center, edges and corners.|以拼图方式比较图像中心、边缘与角落。
light_curve|Build Light Curve|生成光变曲线|Measure targets against reference stars across a sequence to produce a light curve.|对序列中的目标和参考星进行测光，生成光变曲线。
profile|Measure Line Profile|测量线剖面|Sample intensity along a line in the current image and optionally export it.|按指定直线对当前图像的亮度采样，可导出剖面数据。
psf|Measure Stellar PSF|测量恒星 PSF|Fit the selected star to measure its point spread function.|拟合选定恒星以测量其点扩散函数。
seqstat|Export Sequence Statistics|导出序列统计|Write statistics for the frames in a sequence to an output file.|将序列各帧的统计量写入文件。
setmag|Set Magnitude Reference|设置星等基准|Set a reference magnitude for photometry.|为测光设置参考星等。
setphot|Configure Photometry|设置测光参数|Set aperture, sky annulus and signal parameters for photometry.|设置测光孔径、背景环和信号参数。
stat|Read Image Statistics|读取图像统计|Report statistical measurements for the image or its selected region.|输出图像或所选区域的统计量。
tilt|Measure Sensor Tilt|测量传感器倾斜|Compare star sizes across the field to estimate sensor tilt.|比较视场各处的星点大小以估计传感器倾斜。
unsetmag|Clear Magnitude Reference|清除星等基准|Reset the photometric magnitude calibration.|重置测光星等校准。
"""),
    "Coordinate Calibration and Reference Data": ("坐标标定与参考数据", """
addwcs|Transfer WCS|传递 WCS 坐标|Copy WCS coordinates from a reference file, or remove the existing solution when no file is supplied.|从参考文件复制 WCS 坐标，未指定文件时清除现有定位解。
catquery|Export Star Catalogue Query|导出星表查询|Query a catalogue around sky coordinates and save the matching sources to CSV.|按天球坐标查询星表并将匹配星源导出为 CSV。
catsearch|Find Catalogue Object|查找星表天体|Look up a named object in supported catalogues.|在受支持的星表中按名称查找天体。
conesearch|Search Sky Region|搜索天区|Query catalogue sources near a given sky position.|查询指定天球位置附近的星表源。
disto|Inspect Astrometric Distortion|查看天文定位畸变|Display or clear the distortion grid associated with the astrometric solution.|显示或清除天文定位解对应的畸变网格。
platesolve|Plate Solve Image|图像天文定位|Match detected stars to a catalogue to establish sky coordinates for the image.|将检测星点与星表匹配，为图像建立天球坐标。
show|Show Sky Annotations|显示天体标注|Display, list or clear annotations for specified sky positions.|显示、列出或清除指定天球位置的标注。
trixel|Inspect Sky Triangles|查看天区三角网格|List or export the sky triangles used by the catalogue index.|列出或导出星表索引使用的天区三角网格。
"""),
    "Runtime and Session": ("运行与会话", """
capabilities|Inspect CLI Capabilities|查看 CLI 能力|Report build features and runtime capabilities of this Siril executable.|输出当前 Siril 可执行文件的编译功能和运行能力。
cd|Change Working Directory|切换工作目录|Change the session's current working directory.|切换当前会话的工作目录。
clear|Clear Console|清空控制台|Clear the visible console log in Siril.|清除 Siril 控制台中显示的日志。
dir|List Working Files|列出工作目录文件|List the contents of the current directory on Windows.|在 Windows 下列出当前目录内容。
exit|End Session|结束会话|Terminate the Siril session after earlier commands have finished.|在此前命令完成后结束 Siril 会话。
get|Read Settings|读取设置|Read a single preference or list available settings and values.|读取单项首选设置，或列出可用设置与数值。
help|Show Command Help|查看命令帮助|List available commands or explain the syntax for one command.|列出可用命令，或查看指定命令的语法。
ls|List Working Files|列出工作目录文件|List the contents of the current directory.|列出当前工作目录内容。
offline|Disable Network Access|禁用会话联网|Disable network-dependent operations in the current session.|禁用当前会话中依赖网络的操作。
online|Enable Network Access|启用会话联网|Allow the current session to use network-dependent features.|允许当前会话执行需要网络的操作。
parse|Expand Siril Expressions|展开 Siril 字符串表达式|Show how Siril expands a path expression or metadata template.|查看 Siril 如何展开路径表达式或元数据模板。
pwd|Show Working Directory|查看工作目录|Report the current working directory for the session.|输出当前会话所在的工作目录。
pyscript|Run Python Script|运行 Python 脚本|Run a host-approved Python script with the supplied arguments.|使用给定参数运行宿主批准的 Python 脚本。
reloadscripts|Reload Script List|重载脚本列表|Refresh the scripts listed in Siril's interface.|刷新 Siril 界面中的脚本列表。
requires|Check Version Requirement|检查版本要求|Require a minimum Siril version and optionally cap the supported range.|检查 Siril 最低版本，并可设置适用版本上界。
set|Set Session Preference|设置会话首选项|Change a scalar preference for this AstroPhoto session.|修改当前 AstroPhoto 会话中的标量首选项。
set16bits|Use 16-bit Processing|使用 16 位处理|Switch working image processing to 16-bit integer precision.|切换为 16 位整数精度处理图像。
set32bits|Use 32-bit Processing|使用 32 位处理|Switch working image processing to 32-bit floating-point precision.|切换为 32 位浮点精度处理图像。
setcpu|Set Processing Threads|设置处理线程数|Set the number of CPU threads Siril can use.|设置 Siril 可使用的 CPU 线程数量。
setmem|Set Memory Ratio|设置内存比例|Set the proportion of available memory Siril may use.|设置 Siril 可使用的内存比例。
visu|Set Display Cutoffs|设置显示范围|Set the low and high values used to display the image.|设置图像显示所用的低值与高值。
"""),
}


# Sequence variants share the operation's category. Each introduction still identifies its scope.
SEQUENCE_VARIANTS = {
    "seqccm": "ccm",
    "seqcosme": "cosme",
    "seqcosme_cfa": "cosme_cfa",
    "seqcrop": "crop",
    "seqextract_Green": "extract_Green",
    "seqextract_Ha": "extract_Ha",
    "seqextract_HaOIII": "extract_HaOIII",
    "seqfind_cosme": "find_cosme",
    "seqfind_cosme_cfa": "find_cosme_cfa",
    "seqfindstar": "findstar",
    "seqfixbanding": "fixbanding",
    "seqght": "ght",
    "seqinvght": "invght",
    "seqinvmodasinh": "invmodasinh",
    "seqlinstretch": "linstretch",
    "seqmodasinh": "modasinh",
    "seqmtf": "mtf",
    "seqplatesolve": "platesolve",
    "seqprofile": "profile",
    "seqpsf": "psf",
    "seqresample": "resample",
    "seqrl": "rl",
    "seqsb": "sb",
    "seqsetmag": "setmag",
    "seqsplit_cfa": "split_cfa",
    "seqstarnet": "starnet",
    "seqsubsky": "subsky",
    "seqtilt": "tilt",
    "sequnsetmag": "unsetmag",
    "seqwiener": "wiener",
}


SEARCH_ALIASES = {
    "autostretch": ("auto stretch", "一键拉伸"),
    "clahe": ("adaptive histogram equalization", "自适应直方图均衡"),
    "fixbanding": ("banding reduction", "条带降噪"),
    "gauss": ("Gaussian filter", "高斯滤波"),
    "platesolve": ("astrometry", "解算"),
    "register": ("frame alignment", "帧对齐"),
    "rgbcomp": ("channel combination", "通道合成"),
    "stack": ("image integration", "图像积分"),
    "starnet": ("star removal", "去星"),
    "subsky": ("background modeling", "gradient removal", "背景建模", "去梯度"),
    "unsharp": ("USM", "锐化"),
}


PRESENTATION = {}
for category, (_zh, rows) in GROUPS.items():
    for row in rows.strip().splitlines():
        name, *labels = row.split("|")
        PRESENTATION[name] = (category, *labels)

for name, base in SEQUENCE_VARIANTS.items():
    category, en_title, zh_title, en_desc, zh_desc = PRESENTATION[base]
    PRESENTATION[name] = (
        category, f"{en_title} (Sequence)", f"序列 · {zh_title}",
        f"{en_desc} This variant operates on a sequence.",
        f"{zh_desc}此命令用于序列处理。",
    )
