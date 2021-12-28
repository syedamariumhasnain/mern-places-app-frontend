import React, { useState, useRef, useEffect } from "react";

import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  
  const filePickerRef = useRef();

  useEffect(() => {
    if(!file) {
      return;
    }

    // FileReader -- helps us read / parse files, converts binary data
    // into readable / output able file
    const fileReader = new FileReader();

    // FileReader.readAsDataURL() -- create URL, doesn't work with callback, 
    // doesn't return promise so before readAsDataURL() 
    
    // we have to register FileReader.onload() execute the anonymous func.
    // whenever file reader loads a new file or done parsing of file, will 
    // execute once the reading of the file is done and then in here we call 
    // our "state setter" setPreviewURL(), we don't get the passed file as
    // an arg. Instead we have to extract it from FileReader.result.

    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    }

    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = event => {
    console.log(event.target);

    let pickedFile;
    let fileIsValid = isValid;
    if(event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  }

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
      </div>
      {!isValid && <p>{props.errorTest}</p>}
    </div>
  );
};

export default ImageUpload;
