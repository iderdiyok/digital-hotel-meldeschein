import React from 'react';
import {
  pdf,
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Image,
} from '@react-pdf/renderer';

export async function generatePDF(submission: any) {
  const styles = StyleSheet.create({
    page: {
      padding: 24,
      fontSize: 10,
      fontFamily: 'Helvetica',
      lineHeight: 1.3,
    },
    headerContainer: {
      marginBottom: 20,
      borderBottom: '2px solid #2563eb',
      paddingBottom: 10,
    },
    hotelName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1f2937',
      textAlign: 'center',
      marginBottom: 4,
    },
    hotelAddress: {
      fontSize: 10,
      color: '#374151',
      textAlign: 'center',
      marginBottom: 2,
    },
    hotelContact: {
      fontSize: 9,
      color: '#6b7280',
      textAlign: 'center',
      marginBottom: 6,
    },
    documentTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#2563eb',
      textAlign: 'center',
      marginTop: 4,
    },
    sectionTitle: {
      fontSize: 11,
      marginBottom: 4,
      marginTop: 10,
      color: '#2563eb',
      fontWeight: 'bold',
    },
    fieldGroup: {
      marginBottom: 8,
      padding: 6,
      backgroundColor: '#f9fafb',
      borderRadius: 2,
    },
    fieldLabel: {
      fontSize: 8,
      color: '#6b7280',
      marginBottom: 1,
    },
    fieldValue: {
      fontSize: 10,
      marginBottom: 2,
      color: '#111827',
    },
    coTravellerContainer: {
      marginBottom: 4,
      padding: 3,
      backgroundColor: '#f3f4f6',
      borderRadius: 2,
      fontSize: 9,
    },
    coTravellerTitle: {
      fontSize: 9,
      fontWeight: 'bold',
      marginBottom: 2,
      color: '#374151',
    },
    signature: {
      marginTop: 6,
      width: 180,
      height: 60,
      border: '1px solid #d1d5db',
      borderRadius: 3,
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: '#d1d5db',
      marginTop: 12,
      paddingTop: 6,
      fontSize: 8,
      textAlign: 'center',
      color: '#6b7280',
    },
    row: {
      flexDirection: 'row',
      marginBottom: 2,
    },
    column: {
      flex: 1,
      marginRight: 6,
    },
    compactRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 1,
    },
    compactField: {
      flex: 1,
      marginRight: 4,
    },
    inlineField: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: 1,
    },
    inlineLabel: {
      fontSize: 8,
      color: '#6b7280',
      marginRight: 4,
      minWidth: 60,
    },
    inlineValue: {
      fontSize: 10,
      color: '#111827',
      flex: 1,
    },
  });

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* PROFESSIONAL HEADER */}
        <View style={styles.headerContainer}>
          <Text style={styles.hotelName}>Hotel Harburger Hof</Text>
          <Text style={styles.hotelAddress}>
            Schloßmühlendamm 16, 21073 Hamburg
          </Text>
          <Text style={styles.hotelContact}>
            Tel: +49(0)40 - 32 31 07 - 0 | Email: info@hhhof.de
          </Text>
          <Text style={styles.documentTitle}>Digitaler Meldeschein</Text>
        </View>

        {/* HAUPTGAST - Kompaktes Layout */}
        <View style={styles.fieldGroup}>
          <Text style={styles.sectionTitle}>Hauptreisende/r</Text>

          {/* Name in einer Zeile */}
          <View style={styles.compactRow}>
            <View style={styles.compactField}>
              <View style={styles.inlineField}>
                <Text style={styles.inlineLabel}>Vorname:</Text>
                <Text style={styles.inlineValue}>
                  {submission.firstName || 'Nicht angegeben'}
                </Text>
              </View>
            </View>
            <View style={styles.compactField}>
              <View style={styles.inlineField}>
                <Text style={styles.inlineLabel}>Nachname:</Text>
                <Text style={styles.inlineValue}>
                  {submission.lastName || 'Nicht angegeben'}
                </Text>
              </View>
            </View>
          </View>

          {/* Geburtsdatum und Nationalität in einer Zeile */}
          <View style={styles.compactRow}>
            <View style={styles.compactField}>
              <View style={styles.inlineField}>
                <Text style={styles.inlineLabel}>Geboren:</Text>
                <Text style={styles.inlineValue}>
                  {submission.dateOfBirth || 'Nicht angegeben'}
                </Text>
              </View>
            </View>
            <View style={styles.compactField}>
              <View style={styles.inlineField}>
                <Text style={styles.inlineLabel}>Nation:</Text>
                <Text style={styles.inlineValue}>
                  {submission.nationality || 'Nicht angegeben'}
                </Text>
              </View>
            </View>
          </View>

          {/* Adresse kompakt */}
          <View style={styles.inlineField}>
            <Text style={styles.inlineLabel}>Adresse:</Text>
            <Text style={styles.inlineValue}>
              {submission.address || 'Nicht angegeben'}
            </Text>
          </View>

          {/* Check-in/out und Gästeanzahl in einer Zeile */}
          <View style={styles.compactRow}>
            <View style={styles.compactField}>
              <View style={styles.inlineField}>
                <Text style={styles.inlineLabel}>Check-in:</Text>
                <Text style={styles.inlineValue}>
                  {submission.checkIn || 'Nicht angegeben'}
                </Text>
              </View>
            </View>
            <View style={styles.compactField}>
              <View style={styles.inlineField}>
                <Text style={styles.inlineLabel}>Check-out:</Text>
                <Text style={styles.inlineValue}>
                  {submission.checkOut || 'Nicht angegeben'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.inlineField}>
            <Text style={styles.inlineLabel}>Gäste:</Text>
            <Text style={styles.inlineValue}>
              {submission.numberOfGuests || 'Nicht angegeben'}
            </Text>
          </View>
        </View>

        {/* MITREISENDE - Kompakt */}
        {submission.coTravellers?.length > 0 && (
          <View style={styles.fieldGroup}>
            <Text style={styles.sectionTitle}>
              Mitreisende ({submission.coTravellers.length})
            </Text>

            {submission.coTravellers.map((traveller: any, idx: number) => (
              <View key={idx} style={styles.coTravellerContainer}>
                <Text style={styles.coTravellerTitle}>
                  #{idx + 1}: {traveller.firstName} {traveller.lastName}
                </Text>

                {/* Alle Infos in einer kompakten Zeile */}
                <View style={styles.compactRow}>
                  <View style={styles.compactField}>
                    <View style={styles.inlineField}>
                      <Text style={styles.inlineLabel}>Geboren:</Text>
                      <Text style={styles.inlineValue}>
                        {traveller.dateOfBirth || '-'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.compactField}>
                    <View style={styles.inlineField}>
                      <Text style={styles.inlineLabel}>Nation:</Text>
                      <Text style={styles.inlineValue}>
                        {traveller.nationality || '-'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* SIGNATURE */}
        <View style={styles.fieldGroup}>
          <Text style={styles.sectionTitle}>Digitale Unterschrift</Text>
          {submission.signature ? (
            <Image src={submission.signature} style={styles.signature} />
          ) : (
            <Text style={styles.fieldValue}>Keine Unterschrift vorhanden</Text>
          )}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text>
            Erstellt am:{' '}
            {new Date(submission.submittedAt || Date.now()).toLocaleString(
              'de-DE'
            )}
          </Text>
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
