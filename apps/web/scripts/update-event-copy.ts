/**
 * Script para actualizar el copy del evento en Cal.com
 * Actualiza el evento "Consultoría Digital Personalizada" con copy minimalista
 */

import { getCalComClient } from '@/lib/cal-com/client';

const MINIMAL_COPY = ''; // Descripción eliminada - evento sin copy

async function updateEventCopy() {
  try {
    console.log('🔄 Actualizando copy del evento...\n');
    console.log('='.repeat(80));

    const client = getCalComClient();

    // 1. Obtener el evento actual
    console.log('📥 Obteniendo evento actual...');
    const eventTypesResponse = await client.get<any>('/event-types');

    const eventTypeGroups = eventTypesResponse?.data?.eventTypeGroups || [];
    const allEventTypes: any[] = [];

    eventTypeGroups.forEach((group: any) => {
      if (group.eventTypes && Array.isArray(group.eventTypes)) {
        allEventTypes.push(...group.eventTypes);
      }
    });

    if (allEventTypes.length === 0) {
      throw new Error('No se encontraron eventos');
    }

    const event = allEventTypes.find((e: any) => e.slug === 'consultoria-digital');

    if (!event) {
      throw new Error('Evento "consultoria-digital" no encontrado');
    }

    console.log(`✅ Evento encontrado: ${event.title} (ID: ${event.id})\n`);

    // 2. Mostrar copy actual vs nuevo
    console.log('📝 COPY ACTUAL:');
    console.log('-'.repeat(80));
    console.log(event.description || '(sin descripción)');
    console.log('\n');

    console.log('📝 COPY NUEVO:');
    console.log('-'.repeat(80));
    console.log(MINIMAL_COPY || '(sin descripción)');
    console.log('\n');

    // 3. Actualizar el evento
    console.log('⏳ Actualizando evento en Cal.com...\n');

    const updateData = {
      description: MINIMAL_COPY,
    };

    // Intentar actualizar usando PATCH
    try {
      const updatedEvent = await client.patch<any>(
        `/event-types/${event.id}`,
        updateData
      );

      console.log('✅ ¡Evento actualizado exitosamente!\n');
      console.log('📊 Evento actualizado:');
      console.log(`   Título: ${updatedEvent.title || event.title}`);
      console.log(`   ID: ${updatedEvent.id || event.id}`);
      console.log(`   Slug: ${updatedEvent.slug || event.slug}`);
      console.log(`   Nueva descripción: ${updatedEvent.description?.substring(0, 100)}...`);
      console.log('\n');

    } catch (patchError: any) {
      // Si PATCH falla, podría ser porque necesitamos managed user token
      console.error('❌ Error al actualizar con PATCH:', patchError.message);

      if (patchError.message.includes('401') || patchError.message.includes('403')) {
        console.error('\n⚠️  NOTA IMPORTANTE:');
        console.error('   Actualizar event types requiere un "Managed User Access Token"');
        console.error('   La API Key sola puede leer pero no actualizar.');
        console.error('\n   Opciones:');
        console.error('   1. Usar Managed User Token (requiere configuración adicional)');
        console.error('   2. Actualizar manualmente en Cal.com dashboard');
        console.error('   3. Usar OAuth credentials para crear managed users\n');
      }

      throw patchError;
    }

    console.log('='.repeat(80));
    console.log('✅ Proceso completado\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
    if (error instanceof Error) {
      console.error(`   Mensaje: ${error.message}`);
      console.error(`   Stack: ${error.stack}`);
    }
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  updateEventCopy();
}

export { MINIMAL_COPY, updateEventCopy };
