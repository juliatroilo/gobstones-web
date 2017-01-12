const toBinary = (base64) => {
  const raw = atob(base64);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));

  var i;
  for(i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }

  return array;
};

class AttireLoader extends Loader {
  constructor() {
    super();
    this.FILE_EXTENSION = ".attire.json";
    this.BASE64_PREFIX = "data:image/png;base64,";
  }

  save(context) {
    const attire = context.boards.attire;
    if (!attire) return;

    const zip = new JSZip();
    zip.file(attire.name + this.FILE_EXTENSION, this._serialize(attire));

    attire.rules.forEach(rule => {
      const imageBase64 = rule.image.replace(this.BASE64_PREFIX, "");
      const pngContent = toBinary(imageBase64);
      zip.file(rule.fileName, pngContent);
    });

    zip.generateAsync({ type: "blob" }).then(content => {
      this._saveBlob(content, `${attire.name}.gbat`);
    });
  }

  read(context, event, callback) {
    const { file, fileName } = this._readLocalFile(event);

    JSZip.loadAsync(file).then(zip => {
      zip.forEach((relativePath, zipEntry) => {
        if (_.endsWith(relativePath, this.FILE_EXTENSION))
          this._processAttire(context, zipEntry, zip, callback);
      });
    });
  }

  _processAttire(context, zipEntry, zip, callback) {
    const findImage = (path) => {
      const imageZipEntry = zip.files[path];
      if (!imageZipEntry) throw new Error("Missing file in attire: " + path);
      return imageZipEntry;
    };

    zipEntry.async("string").then((json) => {
      const attire = this._deserialize(json);
      if (!attire || !attire.name || !attire.rules) return;

      attire.rules.forEach((rule) => {
        rule.fileName = rule.image;

        findImage(rule.fileName).async("binarystring").then((content) => {
          const imageBase64 = btoa(content);
          rule.image = this.BASE64_PREFIX + imageBase64;
          rule.loaded = true;

          const everyRuleIsLoaded = _.every(attire.rules, { loaded: true });
          if (everyRuleIsLoaded) {
            this._setAttire(context, attire);
            callback();
          }
        });
      });
    });
  }

  _setAttire(context, attire) {
    if (attire && attire.name && attire.rules)
      context.boards.addOrSetAttire(attire);
  }

  _serialize(attire) {
    return JSON.stringify(this._transform(attire), null, 2);
  }

  _deserialize(json) {
    return JSON.parse(json);
  }

  _transform(attire) {
    const copy = _.cloneDeep(attire);
    copy.rules.forEach((rule) => {
      rule.image = rule.fileName;
      delete rule.fileName;
      delete rule.loaded;
    });
    return _.omit(copy, ["enabled"]);
  }
}
