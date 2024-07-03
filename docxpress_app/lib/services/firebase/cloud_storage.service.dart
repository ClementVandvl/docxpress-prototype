import 'dart:io';
import 'dart:typed_data';

import 'package:firebase_storage/firebase_storage.dart';
import 'package:path_provider/path_provider.dart';

class CloudStorageService {
  static final FirebaseStorage _storage = FirebaseStorage.instance;
  static final Reference _storageRef = FirebaseStorage.instance.ref();

  static Future<List<String>> getAllDocuments({String path = ''}) async {
    final ListResult result = await _storageRef.child(path).listAll();
    final List<String> localPaths = [];

    for (final Reference ref in result.items) {
      localPaths.add(await _saveToDisk(ref, ref.fullPath));
    }

    return localPaths;
  }

  static Future<String> getDocument(String path) async {
    final Reference ref = _storageRef.child(path);
    return _saveToDisk(ref, path);
  }

  static Future<void> uploadDocument(String path, Uint8List data) async {
    final Reference ref = _storageRef.child(path);

    String ext = path.split('.').last;
    String contentType = ext == 'pdf' ? 'application/pdf' : 'image/png';

    await ref.putData(data, SettableMetadata(contentType: contentType));
  }

  static Future<String> _saveToDisk(Reference ref, String path) async {
    final Directory appDocDir = await getApplicationDocumentsDirectory();
    // TODO: Save to tmp folder
    final String filePath = "${appDocDir.absolute.path}/$path-${DateTime.now().millisecondsSinceEpoch}";
    final File file = File(filePath);

    final DownloadTask downloadTask = ref.writeToFile(file);
    downloadTask.snapshotEvents.listen((taskSnapshot) {
      switch (taskSnapshot.state) {
        case TaskState.running:
        // TODO: Handle this case.
          break;
        case TaskState.paused:
        // TODO: Handle this case.
          break;
        case TaskState.success:
        // TODO: Handle this case.
          break;
        case TaskState.canceled:
        // TODO: Handle this case.
          break;
        case TaskState.error:
        // TODO: Handle this case.
          break;
      }
    });

    return filePath;
  }
}