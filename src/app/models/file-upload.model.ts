export class FileUploadModel {
  box_file!: string;
  file_name!: string;
  content_type!: string;
  file_content!: string;

  setStorage(_storage: unknown) {
    const storage = _storage as FileUploadModel;
    this.file_name = storage.file_name || '';
    this.content_type = storage.content_type || '';
    this.file_content = storage.file_content || '';
  }
}
