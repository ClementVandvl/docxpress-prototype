import 'package:docxpress/app/document_browser/reference.object.dart';
import 'package:docxpress/app/upload.dart';
import 'package:file_selector/file_selector.dart';
import 'package:flutter/material.dart';

/// A widget that displays a document browser.
///
/// The document browser displays a list of items in a directory and allows the
/// user to navigate through the directory structure.
///
/// It displays the current path at the top of the widget and the list of items
/// below it.
///
/// The [path] parameter is the current path of the document browser. The path
/// must be separated by `/` and must not start with `/` to be displayed correctly.
///
/// The [items] parameter is the list of [ReferenceObject] in the current directory.
class DocumentBrowserWidget extends StatefulWidget {
  const DocumentBrowserWidget({
    super.key,
    required this.path,
    required this.items,
    required this.onItemTap,
    // required this.service
  });

  /// The current path of the document browser.
  ///
  /// The path must be separated by `/` and must not start with `/` to be
  /// displayed correctly.
  final String path;

  /// The list of items in the current directory.
  final List<ReferenceObject> items;

  final void Function(ReferenceObject) onItemTap;

  @override
  State<DocumentBrowserWidget> createState() => _DocumentBrowserWidgetState();
}

class _DocumentBrowserWidgetState extends State<DocumentBrowserWidget> {
  late List<ReferenceObject> _items = widget.items;

  @override
  void didUpdateWidget(covariant DocumentBrowserWidget oldWidget) {
    super.didUpdateWidget(oldWidget);

    final String path = widget.path;
    _items = widget.items;

    if (path.isEmpty) return;

    // Add a reference object to go up one level if the current path is not empty.
    _items.insert(
      0,
      ReferenceObject(
        label: '..',
        path: path.split('/').sublist(0, path.split('/').length - 1).join('/'),
        objectType: ObjectType(
          kind: ObjectKind.folder,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return _DocumentBrowser(
      onItemTap: widget.onItemTap,
      child: Column(
        children: [
          _PathBar(path: widget.path),
          SizedBox(
            height: MediaQuery.sizeOf(context).height * 0.8,
            child: _Content(
              items: _items,
            ),
          ),
        ],
      ),
    );
  }
}

/// An inherited widget that provides the document browser context.
class _DocumentBrowser extends InheritedWidget {
  const _DocumentBrowser({
    required this.onItemTap,
    required super.child,
  });

  final void Function(ReferenceObject) onItemTap;

  static _DocumentBrowser of(BuildContext context) {
    final _DocumentBrowser? result = context.dependOnInheritedWidgetOfExactType<_DocumentBrowser>();
    return result!;
  }

  @override
  bool updateShouldNotify(oldWidget) => false;
}

/// The path bar that displays the current path.
class _PathBar extends StatefulWidget {
  const _PathBar({required this.path});

  final String path;

  @override
  State<_PathBar> createState() => _PathBarState();
}

class _PathBarState extends State<_PathBar> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();

    // Scroll to the end of the path bar when it is first displayed if
    // it is too long to fit in the screen.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeOut,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final List<String> pathParts = widget.path.split('/').where((part) => part.isNotEmpty).toList();
    // If the path ends with `/`, remove the last part
    if (widget.path.endsWith('/') && pathParts.isNotEmpty) pathParts.removeLast();

    return Container(
      alignment: Alignment.centerLeft,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: SingleChildScrollView(
        controller: _scrollController,
        scrollDirection: Axis.horizontal,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Icon(Icons.cloud),
            const Icon(Icons.chevron_right),
            for (int i = 0; i < pathParts.length; i++) ...[
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4.0),
                child: Text(pathParts[i]),
              ),
              const Icon(Icons.chevron_right)
            ],

            // TODO: REMOVE THIS
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

                await onUpload(widget.path, textFieldController.text, file, "png");
              }, () => print('Invalid file type')),
              child: const Icon(Icons.upload),
            )
          ],
        ),
      ),
    );
  }
}

class _Content extends StatelessWidget {
  const _Content({required this.items});

  final List<ReferenceObject> items;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: items.length,
      itemBuilder: (_, index) => _buildItem(context, items[index]),
    );
  }

  Widget _buildItem(BuildContext context, ReferenceObject item) {
    return ListTile(
      leading: Icon(item.objectType.kind == ObjectKind.folder ? Icons.folder : Icons.document_scanner),
      title: Text(item.label, style: const TextStyle(fontSize: 14)),
      onTap: () => _DocumentBrowser.of(context).onItemTap(item),
    );
  }
}
