import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { GeneratedContent } from "@/types";

Font.register({
  family: "NotoSansJP",
  src: "https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "NotoSansJP",
    fontSize: 10,
    lineHeight: 1.6,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
    borderBottom: "1px solid #333",
    paddingBottom: 4,
  },
  text: {
    fontSize: 10,
    lineHeight: 1.8,
  },
});

export default function PDFDocument({ data }: { data: GeneratedContent }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>病歴・就労状況等申立書（下書き）</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>■ 発病から現在までの経過</Text>
          <Text style={styles.text}>{data.history}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>■ 日常生活の状況</Text>
          <Text style={styles.text}>{data.dailyLife}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>■ 就労状況</Text>
          <Text style={styles.text}>{data.employment}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>■ その他特記事項</Text>
          <Text style={styles.text}>{data.other}</Text>
        </View>
      </Page>
    </Document>
  );
}

