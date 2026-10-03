import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/visiteur.dart';
import '../utils/constants.dart';

class VisiteurApiService {
  final String baseUrl = "$apiBaseUrl/api/visits";

  Future<List<Visiteur>> fetchVisiteurs() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');

    try {
      final response = await http.get(
        Uri.parse(baseUrl),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Visiteur.fromJson(json)).toList();
      } else {
        print("❌ Échec de la récupération : ${response.statusCode} - ${response.body}");
        return [];
      }
    } catch (e) {
      print("❌ Exception lors de la récupération : $e");
      return [];
    }
  }

  Future<bool> envoyerVisiteur(Visiteur visiteur) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');

    try {
      final response = await http.post(
        Uri.parse(baseUrl),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode(visiteur.toJsonForPost()),

      );
print("📤 Envoi du visiteur : ${visiteur.toJson()}");        // ligne 1
print("🌐 Code retour API : ${response.statusCode}");       // ligne 2
print("📦 Réponse API : ${response.body}");                 // ligne 3

      if (response.statusCode == 201 || response.statusCode == 200) {
        print("✅ Visiteur ajouté avec succès.");
        return true;
      } else {
        print("❌ Échec de l'ajout : ${response.statusCode} - ${response.body}");
        return false;
      }
    } catch (e) {
      print("❌ Exception réseau : $e");
      return false;
    }
  }

Future<bool> isBadgeActif(String qrCode) async {
  final prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('auth_token');
  final url = Uri.parse("$apiBaseUrl/api/visits/by-qrcode?qrCode=$qrCode");

  final response = await http.get(url, headers: {
    'Authorization': 'Bearer $token',
    'Content-Type': 'application/json',
  });

  if (response.statusCode == 200) {
    final data = jsonDecode(response.body);
    if (data is Map && data['status'] != null && data['status'] != 'CLOTURE') {
      return true; // badge encore actif
    }
  }

  return false; // badge libre ou inconnu
}

  Future<Visiteur?> fetchVisiteurParId(int id) async {
  final prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('auth_token');

  final url = Uri.parse('$apiBaseUrl/api/visits/$id');

  try {
    final response = await http.get(
      url,
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return Visiteur.fromJson(data);
    } else {
      print("❌ Erreur ${response.statusCode} : ${response.body}");
      return null;
    }
  } catch (e) {
    print("❌ Exception réseau : $e");
    return null;
  }
}

}
