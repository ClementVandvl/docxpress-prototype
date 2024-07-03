import 'package:docxpress/app/ocr.dart';
import 'package:docxpress/app/upload.dart';
import 'package:docxpress/app/viewer.dart';
import 'package:docxpress/services/firebase/firebase.service.dart';
import 'package:flutter/material.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await FirebaseService.init();

  runApp(const App());
}

class App extends StatefulWidget {
  const App({super.key});

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  final String path = 'card.png';

  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        bottomNavigationBar: BottomNavigationBar(
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.download),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.upload),
              label: 'Search',
            ),
          ],
          currentIndex: _currentIndex,
          onTap: (int index) {
            setState(() => _currentIndex = index);
          },
          elevation: 0,
          backgroundColor: const Color(0x33FFFCFA),
          type: BottomNavigationBarType.fixed,
          selectedItemColor: Colors.grey,
          selectedFontSize: 10,
          selectedLabelStyle: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w400,
            foreground: Paint()..color = Colors.grey,
          ),
          unselectedLabelStyle: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w400,
            foreground: Paint()..color = Colors.white,
          ),
        ),
        body: SafeArea(
          child: PageView.builder(
            itemCount: 2,
            physics: const NeverScrollableScrollPhysics(),
            onPageChanged: (int index) {
              setState(() => _currentIndex = index);
            },
            itemBuilder: (context, index) => [
              const Viewer(),
              const OCRView(),
            ][_currentIndex],
          ),
        ),
      ),
    );
  }
}
