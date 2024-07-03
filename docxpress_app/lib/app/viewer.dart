import 'dart:io';

import 'package:docxpress/app/document_browser/document.browser.widget.dart';
import 'package:docxpress/app/document_browser/reference.object.dart';
import 'package:docxpress/services/firebase/cloud_storage.service.dart';
import 'package:flutter/material.dart';

final Map<String, List<ReferenceObject>> _documents = {
  '': [
    ReferenceObject(
      path: 'files',
      objectType: ObjectType(
        kind: ObjectKind.folder,
      ),
    ),
  ],
  'files': [
    ReferenceObject(
      path: 'files/id_card',
      objectType: ObjectType(
        kind: ObjectKind.folder,
      ),
    ),
    ReferenceObject(
      path: 'files/passport',
      objectType: ObjectType(
        kind: ObjectKind.folder,
      ),
    ),
  ],
};

class Viewer extends StatefulWidget {
  const Viewer({super.key});

  @override
  State<Viewer> createState() => _ViewerState();
}

class _ViewerState extends State<Viewer> {
  String path = '';

  void _onItemTap(ReferenceObject item) {
    if (item.objectType.kind == ObjectKind.folder) {
      setState(() {
        path = item.path;
      });
    } else if (item.objectType.extension == FileExtension.pdf) {
      print('Opening PDF');
    } else if (item.objectType.extension == FileExtension.png || item.objectType.extension == FileExtension.jpg) {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (context) => _buildImagePreview(item.path),
        ),
      );
    }
  }

  Future<List<ReferenceObject>> _getDocuments() async {
    List<ReferenceObject> documents = [];
    List<String> localPaths = await CloudStorageService.getAllDocuments(path: path);

    for (String localPath in localPaths) {
      documents.add(
        ReferenceObject(
          label: localPath.split('/').last,
          path: localPath,
          objectType: ObjectType(
            kind: ObjectKind.file,
            extension: FileExtension.png,
          ),
        ),
      );
    }

    return documents;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: _getDocuments(),
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          List<ReferenceObject>? paths = snapshot.data;
          if (paths == null) return const Text('No documents found');
          return _buildDocumentList(paths);
        } else {
          return const CircularProgressIndicator();
        }
      },
    );
  }

  Widget _buildDocumentList(List<ReferenceObject> referenceObjects) {
    return DocumentBrowserWidget(
      path: path,
      items: [
        ...?_documents[path],
        ...referenceObjects,
      ],
      onItemTap: _onItemTap,
    );
  }

  Widget _buildImagePreview(String path) {
    return Scaffold(body: Center(child: Image.file(File(path))));
  }
}
