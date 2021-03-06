import React, { useState, useRef } from 'reactn';
import ReactAvatarEditor from 'react-avatar-editor';
import Dropzone from 'react-dropzone';
import AtharesLoader from './AtharesLoader';
import Slider from 'rc-slider/lib/Slider';
import 'rc-slider/assets/index.css';
import EXIF from 'exif-js';
import swal from 'sweetalert';

export default function ImageUpload(props) {
  const editor = useRef(null);

  const [image, setImage] = useState(props.defaultImage);
  const [width] = useState(
    parseFloat(getComputedStyle(document.getElementById('root')).fontSize) * 15,
  );
  const [height] = useState(
    parseFloat(getComputedStyle(document.getElementById('root')).fontSize) * 15,
  );
  const [editMode, setEditMode] = useState(false);
  const [finalImage, setFinalImage] = useState(props.defaultImage);
  const [loading, setLoading] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  const handleDrop = dropped => {
    setImage(dropped[0]);
  };

  const toggleEdit = () => {
    if (props.editMode) {
      props.editMode(!editMode);
    }
    setEditMode(!editMode);
  };
  // const rotate = (angle = 90) => {};
  const onClickSave = async () => {
    try {
      if (editor && editor.current) {
        // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
        // drawn on another canvas, or added to the DOM.
        let canvas = editor.current.getImage().toDataURL('image/jpg');

        let imageURL;

        await fetch(canvas)
          .then(res => res.blob())
          .then(blob => (imageURL = window.URL.createObjectURL(blob)));
        let blob = dataURItoBlob(canvas);

        setFinalImage(imageURL);
        setEditMode(false);
        setLoading(false);

        props.onSet(blob);
        props.editMode(false);

        // If you want the image resized to the canvas size (also a HTMLCanvasElement)
        // const canvasScaled = editor.getImageScaledToCanvas();
      }
    } catch (err) {
      throw new Error(err);
    }
  };
  const dataURItoBlob = dataURI => {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpg' });
  };
  const isValidFile = fileType => {
    const type = /\/(.+)$/.exec(fileType)[1];

    const switcher = {
      jpeg: true,
      png: true,
      gif: true,
    };

    return switcher[type] === true;
  };

  const onChange = () => {
    let file = document.getElementById('imgFile').files[0];
    if (!isValidFile(file.type)) {
      swal(
        'Error',
        'Please use a valid file type such as .jpeg or .png',
        'error',
      );
      return false;
    }

    let reader = new FileReader();
    reader.readAsDataURL(file);
    setLoading(true);

    reader.onloadend = e => {
      EXIF.getData(file, () => {
        var orientation = EXIF.getTag(file, 'Orientation');
        let rotatePic = 0;
        switch (orientation) {
          case 8:
            rotatePic = 270;
            break;
          case 6:
            rotatePic = 90;
            break;
          case 3:
            rotatePic = 180;
            break;
          default:
            rotatePic = 0;
        }
        setLoading(false);
        setImage(reader.result);
        setRotate(rotatePic);
      });
    };
  };
  const sliderChange = pos => {
    setScale(1 + pos / 100);
  };

  let tempImage = image;

  if (!editMode) {
    return (
      <div className='mv4'>
        <div
          style={{
            border: '5px solid #FFFFFF',
            height,
            width,
            borderRadius: '2px',
          }}
          className='row-center'
        >
          <img
            onClick={toggleEdit}
            src={finalImage}
            alt={'profile_pic'}
            crossOrigin='anonymous'
            style={{
              height: '100%',
              minWidth: '100%',
              cursor: 'pointer',
            }}
          />
        </div>
        <div
          className='btn mv2 tc'
          style={{ width: width / 2 - 10 }}
          onClick={toggleEdit}
        >
          Edit Icon
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className='mv4'>
        <div
          className='horizontal'
          style={{
            border: '5px solid #FFFFFF',
            height,
            width,
            borderRadius: '2px',
            justifyContent: 'center',
          }}
        >
          <AtharesLoader />
        </div>
      </div>
    );
  }
  return (
    <div className='mv4'>
      <div>
        <Dropzone
          onDrop={handleDrop}
          multiple={false}
          accept={'image/*'}
          disableClick
          width={width}
          height={height}
          id='create-circle-dropzone'
          style={{
            border: '5px solid #FFFFFF',
            height,
            width,
            borderRadius: '2px',
          }}
        >
          <ReactAvatarEditor
            width={width - 30}
            height={height - 30}
            image={tempImage}
            ref={editor}
            id='create-circle-editor'
            border={10}
            scale={scale}
            crossOrigin={'anonymous'}
            rotate={rotate}
          />
        </Dropzone>
      </div>
      <Slider
        min={0}
        max={100}
        defaultValue={0}
        onChange={sliderChange}
        className='mv3'
        style={{ width }}
      />
      {/*<div
                  className="flex flex-row space-around"
                  style={{ width: width }}
                >
                  <RotateCCW
                    className="ghost w-50"
                    onClick={rotate(-90)}
                  />
                  <RotateCW
                    className="ghost w-50"
                    onClick={rotate(90)}
                  />
                </div>*/}
      <input
        type='file'
        name='file'
        id='imgFile'
        accept='.jpeg,.jpg,.png,.gif'
        onChange={onChange}
      />
      <div className='horizontal'>
        <label htmlFor='imgFile'>
          <div className='btn mv2 tc' style={{ width: width / 2 }}>
            New
          </div>
        </label>

        <div
          className='btn mv2 tc'
          style={{ width: width / 2 }}
          onClick={onClickSave}
        >
          Set
        </div>
      </div>
      <small id='comment-desc' className='f6 white-80'>
        Drag and drop or press "New" to change the image.
      </small>
    </div>
  );
}
