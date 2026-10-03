const List<String> motifs = ["Réunion", "Stage", "Visite de courtoisie", "Autre"];

/// Base URL of visitor-backend. Override at build time:
///   flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8060        (Android emulator)
///   flutter run --dart-define=API_BASE_URL=http://<PC LAN IP>:8060     (physical phone)
const String apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:8060',
);
