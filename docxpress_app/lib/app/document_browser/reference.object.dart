class ReferenceObject {
  ReferenceObject({
    required this.path,
    String? label,
    required this.objectType,
  }) : _label = label;

  final String path;

  /// The label to be displayed in the document browser.
  ///
  /// If not provided, it defaults to the [path].
  String get label => _label ?? path;
  final String? _label;

  final ObjectType objectType;
}

class ObjectType {
  ObjectType({
    required this.kind,
    this.extension,
  }) {
    if (kind != ObjectKind.file) assert(extension == null, 'Folders cannot have an extension');
    if (kind == ObjectKind.file) assert(extension != null, 'Files must have an extension');
  }

  final ObjectKind kind;
  final FileExtension? extension;
}

enum ObjectKind {
  folder,
  file,
}

enum FileExtension {
  pdf,
  png,
  jpg,
}
