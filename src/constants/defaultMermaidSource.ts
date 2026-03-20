export const DEFAULT_MERMAID_SOURCE = `flowchart TB
    subgraph TopLevelA
        direction TB
        nodeA1 --> nodeA2
        subgraph NestedB
            direction LR
            nodeB1 --> nodeB2
        end
        nodeA2 --> nodeB1
    end
    nodeA1 --> TopLevelA`;
