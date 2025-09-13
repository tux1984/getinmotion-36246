# Código en Cuarentena

Este directorio contiene componentes y código que no están actualmente en uso pero que se conservan por precaución.

## ¿Por qué está aquí este código?

- **GuidedTaskExecution.tsx**: Sistema de tareas estático reemplazado por `IntelligentTaskInterface` (sistema AI)
- **StepExecutionModule.tsx**: Componente de pasos estáticos ya no utilizado
- **TaskContextCard.tsx**: Parte del sistema de tareas estático anterior

## ¿Puedo eliminar este código?

⚠️ **NO eliminar inmediatamente**. Este código está en cuarentena por seguridad.

Después de 2-3 semanas de testing en producción sin errores, este código puede eliminarse permanentemente.

## ¿Cómo restaurar si es necesario?

Si alguna funcionalidad falla y se necesita restaurar:
1. Mover el componente de vuelta a su ubicación original
2. Actualizar los imports en los archivos que lo usan
3. Verificar que todas las dependencias están presentes

## Fecha de cuarentena
Enero 2025 - Limpieza integral del codebase