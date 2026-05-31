package com.grup15.socialnetwork.seed;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.grup15.socialnetwork.model.Edge;
import com.grup15.socialnetwork.model.Node;
import com.grup15.socialnetwork.datastructures.graph.Graph;

import java.io.File;
import java.lang.reflect.Field;
import java.util.*;

public class JsonExporter {

    public static void main(String[] args) {
        try {
            System.out.println("JSON dönüştürme işlemi başlıyor...");

            SeedContext context = FixedSocialNetworkSeed.build();
            Graph graph = context.getGraph();

            // 1. REFLECTION İLE GİZLİ MAP'LERİ "HACKLEYİP" ALIYORUZ
            Field nodeIdMapField = Graph.class.getDeclaredField("nodeIdMap");
            nodeIdMapField.setAccessible(true);
            Map<Integer, Node> nodeIdMap = (Map<Integer, Node>) nodeIdMapField.get(graph);

            Field nodeEdgeMapField = Graph.class.getDeclaredField("nodeEdgeMap");
            nodeEdgeMapField.setAccessible(true);
            Map<Node, List<Edge>> nodeEdgeMap = (Map<Node, List<Edge>>) nodeEdgeMapField.get(graph);

            // 2. FRONTEND İÇİN DÜZ (FLAT) LİSTELER HAZIRLIYORUZ
            List<Node> exportNodes = new ArrayList<>(nodeIdMap.values());
            List<Map<String, Object>> exportEdges = new ArrayList<>();

            for (Map.Entry<Node, List<Edge>> entry : nodeEdgeMap.entrySet()) {
                Node currentNode = entry.getKey();
                for (Edge edge : entry.getValue()) {
                    // Yönsüz kenarlar Graph'a iki yönlü eklendiği için JSON'da kopya (duplicate) çıkmasını engelliyoruz
                    if (!edge.isDirected() && edge.getDestination().getID() == currentNode.getID()) {
                        continue;
                    }

                    // Koca Node objesi yerine sadece ID'lerini koyuyoruz (Frontend böyle ister)
                    Map<String, Object> edgeMap = new HashMap<>();
                    edgeMap.put("source", edge.getSource().getID());
                    edgeMap.put("target", edge.getDestination().getID());
                    edgeMap.put("type", edge.getType());
                    edgeMap.put("directed", edge.isDirected());
                    exportEdges.add(edgeMap);
                }
            }

            // 3. PAKETLEYİP JACKSON'A VERİYORUZ
            Map<String, Object> finalExport = new HashMap<>();
            finalExport.put("nodes", exportNodes);
            finalExport.put("edges", exportEdges);

            ObjectMapper mapper = new ObjectMapper();
            mapper.enable(SerializationFeature.INDENT_OUTPUT);
            // Güvenlik önlemi: Boş objelerde tekrar patlamasın
            mapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);

            File outputFile = new File("seed_data.json");
            mapper.writeValue(outputFile, finalExport);

            System.out.println("Şov tamamlandı! Jilet gibi JSON oluşturuldu: " + outputFile.getAbsolutePath());

        } catch (Exception e) {
            System.err.println("Kanka yazdırırken bir hata oldu, buraya bak:");
            e.printStackTrace();
        }
    }
}