import React from 'react';
import { pdf, Document, Page, StyleSheet, Text, View, Image } from '@react-pdf/renderer';

export async function generatePDF(submission: any) {
  const styles = StyleSheet.create({
    page: {
      padding: 24,
      fontSize: 12,
      fontFamily: 'Helvetica'
    },
    header: {
      fontSize: 18,
      marginBottom: 16,
      textAlign: 'center',
      color: '#1f2937',
      fontWeight: 'bold'
    },
    sectionTitle: {
      fontSize: 14,
      marginBottom: 8,
      marginTop: 16,
      color: '#2563eb',
      fontWeight: 'bold'
    },
    fieldGroup: {
      marginBottom: 12,
      padding: 8,
      backgroundColor: '#f9fafb',
      borderRadius: 4
    },
    fieldLabel: {
      fontSize: 10,
      color: '#6b7280',
      marginBottom: 2
    },
    fieldValue: {
      fontSize: 12,
      marginBottom: 4,
      color: '#111827'
    },
    coTravellerContainer: {
      marginBottom: 8,
      padding: 6,
      backgroundColor: '#f3f4f6',
      borderRadius: 3
    },
    coTravellerTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      marginBottom: 4,
      color: '#374151'
    },
    signature: {
      marginTop: 12,
      width: 250,
      height: 80,
      border: '1px solid #d1d5db',
      borderRadius: 4
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: '#d1d5db',
      marginTop: 20,
      paddingTop: 12,
      fontSize: 10,
      textAlign: 'center',
      color: '#6b7280'
    },
    row: {
      flexDirection: 'row',
      marginBottom: 4
    },
    column: {
      flex: 1,
      marginRight: 8
    }
  });

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* HEADER */}
        <Text style={styles.header}>Hotel Harburger Hof – Digitaler Meldeschein</Text>

        {/* HAUPTGAST */}
        <View style={styles.fieldGroup}>
          <Text style={styles.sectionTitle}>📋 Hauptreisende/r</Text>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.fieldLabel}>Vorname</Text>
              <Text style={styles.fieldValue}>{submission.firstName || 'Nicht angegeben'}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.fieldLabel}>Nachname</Text>
              <Text style={styles.fieldValue}>{submission.lastName || 'Nicht angegeben'}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.fieldLabel}>Geburtsdatum</Text>
              <Text style={styles.fieldValue}>{submission.dateOfBirth || 'Nicht angegeben'}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.fieldLabel}>Staatsangehörigkeit</Text>
              <Text style={styles.fieldValue}>{submission.nationality || 'Nicht angegeben'}</Text>
            </View>
          </View>

          <Text style={styles.fieldLabel}>Adresse</Text>
          <Text style={styles.fieldValue}>{submission.address || 'Nicht angegeben'}</Text>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.fieldLabel}>Check-in</Text>
              <Text style={styles.fieldValue}>{submission.checkIn || 'Nicht angegeben'}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.fieldLabel}>Check-out</Text>
              <Text style={styles.fieldValue}>{submission.checkOut || 'Nicht angegeben'}</Text>
            </View>
          </View>

          <Text style={styles.fieldLabel}>Anzahl Gäste</Text>
          <Text style={styles.fieldValue}>{submission.numberOfGuests || 'Nicht angegeben'}</Text>
        </View>

        {/* MITREISENDE */}
        {submission.coTravellers?.length > 0 && (
          <View style={styles.fieldGroup}>
            <Text style={styles.sectionTitle}>👥 Mitreisende ({submission.coTravellers.length})</Text>

            {submission.coTravellers.map((traveller: any, idx: number) => (
              <View key={idx} style={styles.coTravellerContainer}>
                <Text style={styles.coTravellerTitle}>Mitreisende/r #{idx + 1}</Text>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <Text style={styles.fieldLabel}>Vorname</Text>
                    <Text style={styles.fieldValue}>{traveller.firstName || 'Nicht angegeben'}</Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.fieldLabel}>Nachname</Text>
                    <Text style={styles.fieldValue}>{traveller.lastName || 'Nicht angegeben'}</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <Text style={styles.fieldLabel}>Geburtsdatum</Text>
                    <Text style={styles.fieldValue}>{traveller.dateOfBirth || 'Nicht angegeben'}</Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.fieldLabel}>Staatsangehörigkeit</Text>
                    <Text style={styles.fieldValue}>{traveller.nationality || 'Nicht angegeben'}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* SIGNATURE */}
        <View style={styles.fieldGroup}>
          <Text style={styles.sectionTitle}>✍️ Digitale Unterschrift</Text>
          {submission.signature ? (
            <Image src={submission.signature} style={styles.signature} />
          ) : (
            <Text style={styles.fieldValue}>Keine Unterschrift vorhanden</Text>
          )}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text>Erstellt am: {new Date(submission.submittedAt || Date.now()).toLocaleString("de-DE")}</Text>
          <Text>Submission ID: {submission.id || 'Unbekannt'}</Text>
          <Text>Hotel Harburger Hof – Digitaler Meldeschein</Text>
        </View>

      </Page>
    </Document>
  );

  try {
    const asPdf = pdf();
    asPdf.updateContainer(doc);
    
    // Nutze toBlob() statt toBuffer() für bessere Kompatibilität
    const blob = await asPdf.toBlob();
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('❌ Fehler bei PDF-Generierung:', error);
    return null;
  }
}