export const DEFAULT_MERMAID_SOURCE = `flowchart LR
    subgraph TopLevelA
        direction LR
        nodeA1 --> nodeA2
        subgraph NestedB
            direction LR
            nodeB1 --> nodeB2
        end
        nodeA2 --> nodeB1
    end
    nodeA1 --> TopLevelA`;
