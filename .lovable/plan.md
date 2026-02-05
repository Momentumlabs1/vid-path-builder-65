
# Plan: Veröffentlichen-Button im FunnelBuilder hinzufügen

## Problem-Zusammenfassung

Der Builder hat nur einen "Speichern"-Button, aber keinen "Veröffentlichen"-Button. Das führt dazu, dass:
1. Änderungen gespeichert werden (in die Datenbank)
2. ABER der Funnel bleibt auf "privat" (`is_public: false`)
3. Der EmbedViewer lädt nur öffentliche Funnels (`is_public: true`)
4. Externe Websites sehen daher keine Änderungen

## Lösung

### Neue "Veröffentlichen"-Funktion im FunnelBuilder

**Datei: `src/components/funnel/FunnelBuilder.tsx`**

1. **Neuer Button "Veröffentlichen"** neben dem Speichern-Button
2. Die Funktion `publishFunnel` wird:
   - Den Funnel speichern (structure update)
   - `is_public: true` setzen
   - Erfolgsmeldung mit der öffentlichen URL anzeigen

```typescript
const publishFunnel = async () => {
  let nameToSave = funnelName.trim();
  
  if (!nameToSave) {
    nameToSave = `funnel-${Date.now()}`;
    setFunnelName(nameToSave);
  }

  setSaving(true);
  try {
    const funnelStructure = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type
      }))
    };

    // Upsert mit is_public: true
    const { error } = await supabase
      .from('funnels')
      .upsert({
        name: nameToSave,
        structure: funnelStructure as any,
        is_public: true,
        user_id: null
      });
    
    if (error) throw error;
    setCurrentFunnelId(nameToSave);

    toast({
      title: "🚀 Veröffentlicht!",
      description: `Funnel ist jetzt live unter: /embed/${nameToSave}`,
    });
  } catch (error) {
    console.error('Error publishing funnel:', error);
    toast({
      title: "❌ Fehler beim Veröffentlichen",
      description: "Funnel konnte nicht veröffentlicht werden.",
      variant: "destructive",
    });
  } finally {
    setSaving(false);
  }
};
```

3. **Neuer Button im Header** (nach "URL kopieren"):

```typescript
<Button 
  variant="default" 
  size="sm" 
  onClick={publishFunnel}
  disabled={saving}
  className="bg-green-600 hover:bg-green-700 text-white"
>
  <Globe className="w-4 h-4 mr-2" />
  {saving ? 'Veröffentlichen...' : 'Veröffentlichen'}
</Button>
```

4. **Import hinzufügen**: `Globe` von lucide-react

## Betroffene Dateien

| Datei | Änderung |
|-------|----------|
| `src/components/funnel/FunnelBuilder.tsx` | Neue `publishFunnel` Funktion + Button |

## Erwartetes Ergebnis

Nach der Implementierung:
- **Speichern**: Speichert nur die Struktur (bleibt privat oder behält aktuellen Status)
- **Veröffentlichen**: Speichert die Struktur UND setzt `is_public: true`
- Externe Websites sehen sofort die Änderungen nach dem Klick auf "Veröffentlichen"

## Workflow für Benutzer

```text
┌─────────────────────────────────────────────────────────────┐
│                      FunnelBuilder Header                    │
├─────────────────────────────────────────────────────────────┤
│ [Dashboard] [Funnel Name...] [● Gespeichert]                │
│                                                              │
│         [Speichern] [Vorschau] [URL kopieren] [Veröffentlichen] │
│                                              ↑               │
│                                              │               │
│                                    NEU: Grüner Button        │
│                                    → Speichert + is_public   │
└─────────────────────────────────────────────────────────────┘
```

## Hinweis: Lovable "Publish" vs. Funnel "Veröffentlichen"

- **Lovable Publish** (oben rechts): Deployed den CODE auf die Production-URL
- **Funnel Veröffentlichen** (im Builder): Setzt `is_public: true` in der DATENBANK

Beide sind unabhängig voneinander. Die Datenbank wird automatisch synchronisiert - du musst nur den Funnel im Builder veröffentlichen.
