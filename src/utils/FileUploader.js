


import React from 'react';
import lodash from 'lodash';

import {forkJoin, Observable} from 'rxjs';
// @ts-ignore
import * as S3Upload from 'react-s3-uploader/s3upload';

const URL_S3_SERVER = "https://api.apparta.co/";





const DEFAULT_UPLOAD_OPTIONS = {
  name: false,
  path: 'files',
  validate: {
    match: '',
    maxSize: 48828.125,
  },
  onProgress: (progress) => {},
};

const DEFAULT_OPTIONS = {
  name: null,
  path: 'files',
  validate: {
    match: '',
    maxSize: 48828.125,
  },
};

export class ErrorFile extends Error {
  source;
  constructor(message, source) {
    super(message)
    this.name = 'ErrorFile';
    this.message = message || 'File invalid';
    this.source = source;
    this.stack = new Error().stack;
  }
}

export function getFileName(fileName) {
  const _fileName = fileName.split('.');
  if (_fileName.length === 1) {
    return _fileName[0];
  }
  _fileName.pop();
  return _fileName.join('.');
}

export function getFileType(fileName) {
  const _fileName = fileName.split('.');
  if (_fileName.length === 1) {
    return '';
  }
  return `.${_fileName.pop()}`;
}

export function validateFile(options) {
  return (file, callBack) => {
    if (file.size / 1024 > options.maxSize) {
      throw new ErrorFile(
        'Tamaño maximo exedido',
        {file: {name: file.name, size: file.size}},
      );
    }

    const match = new RegExp(options.match);
    const notAllowed = /(\.0XE|\.73K|\.89K|\.8CK|\.A6P|\.A7R|\.AC|\.ACC|\.ACR|\.ACTC|\.ACTION|\.ACTM|\.AHK|\.AIR|\.APK|\.APP|\.APPIMAGE|\.APPLESCRIPT|\.ARSCRIPT|\.ASB|\.AZW2|\.BA_|\.BAT|\.BEAM|\.BIN|\.BTM|\.CACTION|\.CEL|\.CELX|\.CGI|\.CMD|\.COF|\.COFFEE|\.COM|\.COMMAND|\.CSH|\.CYW|\.DEK|\.DLD|\.DMC|\.DS|\.DXL|\.E_E|\.EAR|\.EBM|\.EBS|\.EBS2|\.ECF|\.EHAM|\.ELF|\.EPK|\.ES|\.ESH|\.EX4|\.EX5|\.EX_|\.EXE|\.EXE1|\.EXOPC|\.EZS|\.EZT|\.FAS|\.FKY|\.FPI|\.FRS|\.FXP|\.GADGET|\.GPE|\.GPU|\.GS|\.HAM|\.HMS|\.HPF|\.HTA|\.ICD|\.IIM|\.IPA|\.IPF|\.ISU|\.ITA|\.JAR|\.JS|\.JSE|\.JSF|\.JSX|\.KIX|\.KSH|\.KX|\.LO|\.LS|\.M3G|\.MAC|\.MAM|\.MCR|\.MEL|\.MEM|\.MIO|\.MLX|\.MM|\.MRC|\.MRP|\.MS|\.MSL|\.MXE|\.N|\.NCL|\.NEXE|\.ORE|\.OSX|\.OTM|\.OUT|\.PAF|\.PAF.EXE|\.PEX|\.PHAR|\.PIF|\.PLSC|\.PLX|\.PRC|\.PRG|\.PS1|\.PVD|\.PWC|\.PYC|\.PYO|\.QIT|\.QPX|\.RBF|\.RBX|\.RFU|\.RGS|\.ROX|\.RPJ|\.RUN|\.RXE|\.S2A|\.SBS|\.SCA|\.SCAR|\.SCB|\.SCPT|\.SCPTD|\.SCR|\.SCRIPT|\.SCT|\.SEED|\.SERVER|\.SHB|\.SMM|\.SPR|\.TCP|\.THM|\.TIAPP|\.TMS|\.U3P|\.UDF|\.UPX|\.VBE|\.VBS|\.VBSCRIPT|\.VDO|\.VEXE|\.VLX|\.VPM|\.VXP|\.WCM|\.WIDGET|\.WIZ|\.WORKFLOW|\.WPK|\.WPM|\.WS|\.WSF|\.WSH|\.X86|\.XAP|\.XBAP|\.XLM|\.XQT|\.XYS|\.ZL9)$/gi;
    if (options.match && !match.test(file.name)) {
      throw new ErrorFile(
        `Formato invalido. (${file.name})`,
        {file: {name: file.name, size: file.size}},
      );
    }

    if (notAllowed.test(file.name)) {
      throw new ErrorFile(
        `Archivo no permitido. (${file.name})`,
        {file: {name: file.name, size: file.size}},
      );
    }

    callBack(file);
  };
}

export function uploadFile(file, options = DEFAULT_UPLOAD_OPTIONS) {
  const _options = lodash.merge({}, DEFAULT_UPLOAD_OPTIONS, options);

  return new Observable((subscriber) => {
    new S3Upload({
      fileElement: {files: [file]},
      signingUrl: 's3Client/sign',
      preprocess: validateFile(_options.validate),
      onProgress: _options.onProgress,
      onFinishS3Put: (fileS3) => {
        subscriber.next({
          ...fileS3,
          originName: file.name,
          userName: _options.name,
        });
        subscriber.complete();
      },
      onError: (error) => subscriber.error(error),
      signingUrlMethod: 'GET',
      signingUrlWithCredentials: true,
      uploadRequestHeaders: {'x-amz-acl': 'public-read'},
      contentDisposition: 'auto',
      server: URL_S3_SERVER,
      scrubFilename: (filename) =>
        `${new Date().valueOf()}-${_options.name || getFileName(filename)}${getFileType(filename)}`,
      s3path: `AppartaWeb/static/${_options.path}/${
        _options.name ? `${_options.name}/` : ''
      }`,
    });
  });
}

export function onUploadFile(event, options) {
  console.log({event})
  const _options = lodash.merge({}, DEFAULT_OPTIONS, options);
  // stop event
  event.stopPropagation();
  event.preventDefault();

  const fileKeys = Object.keys(event.target.files || {});

  return forkJoin(
    fileKeys.map((file) => !!event.target.files &&
      uploadFile(event.target.files[Number(file)], _options),
    ),
  );
}

export function onUploadFileVersionHurgot(files, _options) {
  const fileKeys = Object.keys(files || {});

  return forkJoin(
    fileKeys.map((file) => files &&
      uploadFile(files[Number(file)], _options),
    ),
  );
}