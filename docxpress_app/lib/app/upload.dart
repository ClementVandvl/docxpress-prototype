import 'package:docxpress/services/firebase/cloud_storage.service.dart';
import 'package:file_selector/file_selector.dart';
import 'package:flutter/material.dart';

void uploadDocument(void Function(XFile xFile) onUpload, VoidCallback onExtensionError) async {
  const XTypeGroup typeGroup = XTypeGroup(
    label: 'Your document to upload',
    extensions: ['pdf', 'png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'],
    uniformTypeIdentifiers: ['public.image', 'public.data'],
  );
  final XFile? xFile = await openFile(acceptedTypeGroups: <XTypeGroup>[typeGroup]);

  if (xFile == null) return;

  final String extension = xFile.name.split(".").last;
  if (!['pdf', 'png', 'jpg'].contains(extension)) {
    onExtensionError();
    return;
  }

  onUpload(xFile);
}

int documentUploaded = 0;

Future<void> onUpload(String path, String fileName, XFile xFile, String ext) async {
  ext = ext.toLowerCase();
  await CloudStorageService.uploadDocument("$path/$fileName.$ext", await xFile.readAsBytes());
  documentUploaded++;
}
