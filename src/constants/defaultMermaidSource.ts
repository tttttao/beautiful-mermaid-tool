export const DEFAULT_MERMAID_SOURCE = `flowchart TD
    Start([User opens tool]) --> Input[Write Mermaid syntax]
    Input --> Render{Debounced render}
    Render -->|Valid| Preview[Preview updates on canvas]
    Render -->|Invalid| Error[Keep last good diagram]
    Preview --> Zoom[Zoom and pan freely]
    Zoom --> Export[Export crisp PNG]
    Export --> Done([Share diagram])
`
