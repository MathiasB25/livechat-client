// Redux
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as Actions from '../../../redux/actions'
// Color Picker
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
// moment
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import useClickOutSide from "../../../hooks/useClickOutSide";
// Image crop
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../../pages/api/user/cropImage';
import useAxiosConfig from "../../../hooks/useAxiosConfig";
import axios from "axios";
import randomId from "../../../hooks/randomId";

function AppSettingsProfile({ user, state, actions }) {

    const [ saveError, setSaveError ] = useState(false);
    const [ showSave, setShowSave ] = useState(false);
    const [ showColorPicker, setShowColorPicker ] = useState(false);
    const [ color, setColor ] = useColor("hex", `${user.bannerColor}`);

    const handleShowColorPicker = () => {
        setShowColorPicker(!showColorPicker)
    };

    const colorPicker = useRef(null);
    useClickOutSide(colorPicker, handleShowColorPicker);

    useEffect(() => {
        if(color.hex != user.bannerColor) {
            setShowSave(true);
        }
    }, [color])

    const resetChanges = () => {
        const rgb = hexToRgb(user.bannerColor);
        const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        setColor({ hex: user.bannerColor, hsv, rgb})
        setShowSave(false);
        setSaveError(false);
    }

    const saveChanges = () => {
        actions.updateUserBannerColor(color.hex, callback);

        function callback (cb) {
            if(cb.success) {
                setShowSave(false);
                setShowColorPicker(false);
                setSaveError(false);
            } else {
                setSaveError(true);
            }
        }
    }


    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          a: undefined
        } : null;
    }

    function rgbToHsv(r, g, b) {
        r /= 255, g /= 255, b /= 255;
      
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;
      
        var d = max - min;
        s = max == 0 ? 0 : d / max;
      
        if (max == min) {
          h = 0; // achromatic
        } else {
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
      
          h /= 6;
        }
      
        return { h, s, v, a: undefined };
    }

    // Image crop
    const fileInput = useRef(null);
    const [ inputFile, setInputFile ] = useState(null);
    const [ showImageCropper, setShowImageCropper ] = useState(false);
    const [ showCropperAnim, setShowCropperAnim ] = useState(false);
    const [ imageSrc, setImageSrc ] = useState('');
    const [ crop, setCrop ] = useState({ x: 0, y: 0 });
    const [ zoom, setZoom ] = useState(1);
    const [ aspect, setAspect ] = useState(1);
    const [ croppedAreaPixels, setCroppedAreaPixels ] = useState(null);
    const [ croppedImage, setCroppedImage ] = useState(null);

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }

    const urlToObject = async (image) => {
        const response = await fetch(image);
        // here image is url/location of image
        const blob = await response.blob();
        const file = new File([blob], `${ randomId() }.jpg`, { type: blob.type });
        return file;
    }

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels
            )
            setCroppedImage(croppedImage)

            const formData = new FormData();
            const file = await urlToObject(croppedImage);
            formData.append('file', file);
    
            const config = useAxiosConfig();
            const { data } = await axios.request({
                method: 'post',
                url: '/api/user/profilePhoto',
                headers: { 
                    'Authorization': config.headers.Authorization, 
                    'content-type': 'multipart/form-data'
                },
                data: formData
            })

            actions.updateProfilePhoto(data.data.url);
            
            setShowCropperAnim(true);
            setTimeout(() => {
                setShowImageCropper(false);
                setShowCropperAnim(false);
                setImageSrc(null);
                setZoom(1)
                setCrop({ x: 0, y: 0 })
                setInputFile(null);
            }, 170)
        } catch (error) {
            console.log(error)
        }

    }, [croppedAreaPixels]);

    const handleCancel = () => {
        setShowCropperAnim(true);
        setTimeout(() => {
            setShowImageCropper(false);
            setShowCropperAnim(false);
            setImageSrc(null);
            setZoom(1)
            setCrop({ x: 0, y: 0 })
            setInputFile(null);
        }, 170)
    }

    let fileName;
    useEffect(() => {
        var fullPath = inputFile?.value;
        if (fullPath) {
            var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
            var filename = fullPath.substring(startIndex);
            if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                filename = filename.substring(1);
            }
            fileName = filename;

            const file = URL.createObjectURL(inputFile.files[0]);
            setImageSrc(file);
            setShowImageCropper(true);
        }
    }, [inputFile])

    const [ contrastYIQ, setContrastYIQ ] = useState(null);

    useEffect(() => {
        if(color.hex) {
            setContrastYIQ(getContrastYIQ(color.hex));
        }
    }, [color])

    function getContrastYIQ(hexcolor){
        var r = parseInt(hexcolor.substring(1,3),16);
        var g = parseInt(hexcolor.substring(3,5),16);
        var b = parseInt(hexcolor.substring(5,7),16);
        var yiq = ((r*299)+(g*587)+(b*114))/1000;
        return (yiq >= 128) ? 'black' : 'zinc-300';
    }
    
    return(
        <div className="flex flex-col px-10 w-10/12 opacity-anim">
            <div className="flex flex-col gap-5 pb-10">
                <div className="text-2xl text-zinc-200 font-semibold">
                    <div>Mi Perfil</div>
                </div>
                <div className="flex">
                    <div className="w-1/2 pr-4">
                        <div className="flex flex-col gap-2 pb-8">
                            <div className="uppercase font-bold">Avatar</div>
                            <div className="flex gap-1">
                                <label className="py-2 px-4 bg-violet-500 hover:bg-violet-800 text-white rounded transition-colors cursor-pointer" htmlFor="changeAvatar">Cambiar Avatar</label>
                                <input ref={fileInput} className="hidden" type="file" name="file" id="changeAvatar" value={ fileName } onChange={ e => setInputFile(e.target) } />
                                <div className="py-2 px-4 hover:underline text-white  cursor-pointer">Eliminar Avatar</div>
                            </div>
                        </div>
                        { showImageCropper && (
                            <div className={`absolute flex items-center justify-center left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 right-0 bottom-0 z-10 ${ showCropperAnim ? 'opacity-anim-close' : 'opacity-anim'}`}>
                                <div className="bg-app-0 rounded-lg pt-0" style={{width: '700px'}}>
                                    <div className="flex items-center h-[4.5rem] px-5">
                                        <div className="text-2xl text-zinc-200 font-semibold">Editar imagen</div>
                                    </div>
                                    <div className="flex flex-col pl-5 pr-5" style={{height: '450px'}}>
                                        <div className="h-full">
                                            <Cropper
                                                image={imageSrc}
                                                crop={crop}
                                                zoom={zoom}
                                                aspect={aspect}
                                                cropShape="round"
                                                showGrid={false}
                                                onCropChange={setCrop}
                                                onCropComplete={onCropComplete}
                                                onZoomChange={setZoom}
                                            />
                                        </div>
                                        <div className="w-2/3 mx-auto flex items-center rounded-b-lg py-5">
                                            <div className="text-zinc-300">
                                                <i className="fa-solid fa-image"></i>
                                            </div>
                                            <div className="flex items-center justify-center w-full h-full gap-3 px-4">
                                                <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(e.target.value)}  />
                                            </div>
                                            <div className="text-4xl text-zinc-300">
                                                <i className="fa-solid fa-image"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full bottom-0 h-[4.5rem] flex items-center bg-app-3 rounded-b-lg text-zinc-200">
                                        <div className="flex items-center justify-end w-full h-full gap-3 px-4">
                                            <div className="py-[.35rem] px-4 hover:underline cursor-pointer" onClick={handleCancel}>Cancelar</div>
                                            <div className="py-[.35rem] px-4 bg-violet-500 hover:bg-violet-800 transition-colors rounded-md cursor-pointer text-zinc-100" onClick={showCroppedImage}>Guardar</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-black opacity-60 w-screen h-screen absolute" style={{zIndex: '-1'}}></div>
                            </div>
                        )}
                        <div className="flex flex-col gap-2 pt-8 border-t border-neutral-700 relative">
                            <div className="uppercase font-bold">Color de fondo</div>
                            <div className={`flex items-start justify-end w-20 h-14 rounded-md cursor-pointer`} onClick={handleShowColorPicker} style={{backgroundColor: `${color.hex}`}}>
                                <i className={`fa-solid fa-pen text-${contrastYIQ} p-[.3rem] text-sm`}></i>
                            </div>
                            { showColorPicker && (
                                <div ref={colorPicker} className="absolute opacity-anim left-24 z-20">
                                    <ColorPicker width={456} height={228} color={color} onChange={setColor} hideHSV dark />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-1/2 pl-4">
                        <div className="bg-app-2 rounded-lg">
                            <div className="rounded-t-lg" style={{minHeight: '6rem', backgroundColor: `${color.hex}`}}></div>
                            <div className="relative bg-app-1 rounded-b-lg p-4 pt-0">
                                <div className="absolute left-4 rounded-full" style={{top: '-4rem'}}>
                                    <div className="relative">
                                        {user?.profilePhoto ? (
                                            <img src={user?.profilePhoto} width={40} height={40} className="absolute top-2 left-2 w-28 h-28 rounded-full" alt="User profile photo" style={{zIndex: '5'}} />
                                        ) : (
                                            <div className="flex items-center justify-center w-28 h-28 bg-app-5 rounded-full text-5xl absolute top-2 left-2" style={{zIndex: '5'}}>
                                                <div>{user?.username?.slice(0, 1)}</div>
                                            </div>
                                        )}
                                        <div className="absolute top-0 left-0 w-32 h-32 bg-app-1 rounded-full" style={{zIndex: '1'}}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-2 py-10"></div>
                                <div className="flex flex-col gap-5 bg-app-5 p-3 px-4 rounded-lg">
                                    <div className="flex items-end text-2xl font-semibold select-text">
                                        <div className="text-zinc-200">{user?.username}</div>
                                        <div>{`#${user?.tag}`}</div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="uppercase text-zinc-200 font-semibold">Miembro de LiveChat desde</div>
                                        <div>{moment(user?.createdAt).format('ll')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            { showSave && (
                <div className="flex justify-between items-center bg-app-8 rounded-md p-3">
                    <div className="flex items-center">
                        { saveError && (
                            <div className="px-2 text-red-600 text-2xl">
                                <i className="fa-regular fa-xmark"></i>
                            </div>
                        )}
                        <div className="text-lg px-2 text-zinc-300">{ saveError ? 'Hubo un error al guardar los cambios' : 'Tienes cambios sin guardar'}</div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="py-2 px-4 cursor-pointer hover:underline text-zinc-300" onClick={resetChanges}>Deshacer</div>
                        <div className="py-2 px-4 bg-green-700 hover:bg-green-800 transition-colors text-white rounded-md cursor-pointer" onClick={saveChanges}>Guardar cambios</div>
                    </div>
                </div>
            )}
        </div>
    )
}

const mapStateToProps = (state) => ({
	state: state
});

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(Actions, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AppSettingsProfile);