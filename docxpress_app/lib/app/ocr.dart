import 'package:docxpress/app/upload.dart';
import 'package:file_selector/file_selector.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class OCRView extends StatefulWidget {
  const OCRView({super.key});

  @override
  State<OCRView> createState() => _OCRViewState();
}

class _OCRViewState extends State<OCRView> {
  Future<String> _ocr(XFile file) async {
    String path = file.path;

    // Base64 encode the file
    final bytes = await file.readAsBytes();

    final http.Response res = await http.post(
      // Uri.parse("http://localhost:3000/ocr"),
      Uri.parse("http://62.72.19.90:3000/ocr"),
      headers: {
        'Content-Type': 'image/png',
      },
      body: bytes,
    );

    print("Doc is: ${res.body}");
    return res.body;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      child: Column(
        children: [
          const Text(
            'OCR View',
            style: TextStyle(fontSize: 24),
          ),
          GestureDetector(
            onTap: () => uploadDocument((XFile file) async {
              TextEditingController textFieldController = TextEditingController();

              await showDialog(
                context: context,
                builder: (_) => AlertDialog(
                  content: TextField(
                    controller: textFieldController,
                    decoration: const InputDecoration(hintText: "File name..."),
                  ),
                  actions: [
                    ElevatedButton(
                      child: const Text('CANCEL'),
                      onPressed: () {
                        Navigator.pop(context);
                      },
                    ),
                    ElevatedButton(
                      child: const Text('OK'),
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                    ),
                  ],
                ),
              );

              String res = await _ocr(file);
              String path = res == "id_card"
                  ? "files/id_card"
                  : res == "passport"
                      ? "files/passport"
                      : "files/";

              print("Saving to $path");
              await onUpload(path, textFieldController.text, file, file.name.split(".").last);
            }, () => print('Invalid file type')),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Upload Document'),
                SizedBox(width: 16),
                Icon(Icons.upload, size: 32,),
              ],
            ),
          )
        ],
      ),
    );
  }
}
