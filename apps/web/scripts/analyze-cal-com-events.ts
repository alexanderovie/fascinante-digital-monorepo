/**
 * Script para analizar eventos de Cal.com
 * Analiza el copy y cantidad de eventos disponibles
 */

import { getCalComClient } from '@/lib/cal-com/client';

interface EventTypeAnalysis {
  id: number;
  slug: string;
  title: string;
  description: string;
  safeDescription?: string; // HTML version
  length: number;
  price: number;
  currency: string;
  metadata?: {
    wordCount: number;
    characterCount: number;
    hasEmojis: boolean;
    emojiCount: number;
  };
}

async function analyzeCalComEvents() {
  try {
    console.log('🔍 Analizando eventos de Cal.com...\n');
    console.log('='.repeat(80));

    const client = getCalComClient();
    const response = await client.get<any>('/event-types');

    // Extraer event types de la estructura de respuesta
    const eventTypeGroups = response?.data?.eventTypeGroups || [];
    const allEventTypes: any[] = [];

    eventTypeGroups.forEach((group: any) => {
      if (group.eventTypes && Array.isArray(group.eventTypes)) {
        allEventTypes.push(...group.eventTypes);
      }
    });

    console.log(`\n📊 RESUMEN:`);
    console.log(`Total de Event Types: ${allEventTypes.length}\n`);

    if (allEventTypes.length === 0) {
      console.log('⚠️  No se encontraron eventos.');
      return;
    }

    // Analizar cada evento
    const analyses: EventTypeAnalysis[] = allEventTypes.map((event: any) => {
      const description = event.description || '';
      const safeDescription = event.safeDescription || '';

      // Contar palabras y caracteres (sin HTML)
      const textOnly = safeDescription
        .replace(/<[^>]*>/g, '') // Remover HTML tags
        .replace(/\s+/g, ' ')
        .trim();

      const wordCount = textOnly.split(/\s+/).filter(Boolean).length;
      const characterCount = textOnly.length;

      // Detectar emojis
      const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
      const emojis = description.match(emojiRegex) || [];
      const hasEmojis = emojis.length > 0;
      const emojiCount = emojis.length;

      return {
        id: event.id,
        slug: event.slug,
        title: event.title,
        description,
        safeDescription,
        length: event.length,
        price: event.price || 0,
        currency: event.currency || 'usd',
        metadata: {
          wordCount,
          characterCount,
          hasEmojis,
          emojiCount,
        },
      };
    });

    // Mostrar análisis detallado
    analyses.forEach((analysis, index) => {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`📅 EVENTO ${index + 1}: ${analysis.title}`);
      console.log(`   ID: ${analysis.id}`);
      console.log(`   Slug: ${analysis.slug}`);
      console.log(`   Duración: ${analysis.length} minutos`);
      console.log(`   Precio: $${analysis.price} ${analysis.currency.toUpperCase()}`);
      console.log(`\n   📝 COPY (Texto plano):`);
      console.log(`   ${'-'.repeat(76)}`);
      const descriptionLines = analysis.description.split('\n');
      descriptionLines.forEach((line: string) => {
        console.log(`   ${line}`);
      });

      console.log(`\n   📊 METADATA:`);
      console.log(`   - Palabras: ${analysis.metadata.wordCount}`);
      console.log(`   - Caracteres: ${analysis.metadata.characterCount}`);
      console.log(`   - Emojis: ${analysis.metadata.emojiCount} ${analysis.metadata.hasEmojis ? '✅' : '❌'}`);

      if (analysis.safeDescription) {
        console.log(`\n   🔤 COPY (HTML):`);
        console.log(`   ${'-'.repeat(76)}`);
        const htmlLines = analysis.safeDescription.split('\n').slice(0, 10); // Primeras 10 líneas
        htmlLines.forEach((line: string) => {
          console.log(`   ${line}`);
        });
        if (analysis.safeDescription.split('\n').length > 10) {
          console.log(`   ... (${analysis.safeDescription.split('\n').length - 10} líneas más)`);
        }
      }
    });

    // Resumen final
    console.log(`\n${'='.repeat(80)}`);
    console.log(`\n📈 RESUMEN ESTADÍSTICO:`);
    console.log(`   Total eventos: ${analyses.length}`);
    console.log(`   Promedio palabras: ${Math.round(analyses.reduce((sum, a) => sum + a.metadata.wordCount, 0) / analyses.length)}`);
    console.log(`   Promedio caracteres: ${Math.round(analyses.reduce((sum, a) => sum + a.metadata.characterCount, 0) / analyses.length)}`);
    console.log(`   Total emojis: ${analyses.reduce((sum, a) => sum + a.metadata.emojiCount, 0)}`);
    console.log(`\n✅ Análisis completado\n`);

  } catch (error) {
    console.error('❌ Error analizando eventos:', error);
    if (error instanceof Error) {
      console.error(`   Mensaje: ${error.message}`);
    }
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  analyzeCalComEvents();
}

export { analyzeCalComEvents };
