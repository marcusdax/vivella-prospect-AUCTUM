# src/ai/probate/genealogy_gnn.py
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import RGCNConv

class GenealogyGNN(nn.Module):
    def __init__(self, in_features, hidden_features, num_relations):
        super(GenealogyGNN, self).__init__()
        # Relational Graph Convolutional Network layers for edge-type reasoning
        self.conv1 = RGCNConv(in_features, hidden_features, num_relations)
        self.conv2 = RGCNConv(hidden_features, hidden_features, num_relations)
        self.classifier = nn.Linear(hidden_features * 2, 1)

    def forward(self, x, edge_index, edge_type, edge_label_index):
        # 1. Relational Graph Convolution Message Passing
        h = self.conv1(x, edge_index, edge_type)
        h = F.relu(h)
        h = self.conv2(h, edge_index, edge_type)
        
        # 2. Link Prediction (predict if edge exists between two nodes)
        src, dst = edge_label_index[0], edge_label_index[1]
        edge_features = torch.cat([h[src], h[dst]], dim=-1)
        
        # Output probability score of the relationship edge
        return torch.sigmoid(self.classifier(edge_features))

def test_model_instantiation():
    # Instantiate GNN and verify architecture
    model = GenealogyGNN(in_features=32, hidden_features=64, num_relations=3)
    print("[Genealogy GNN] Heterogeneous Graph convolution model instantiated successfully.")
    return model

if __name__ == "__main__":
    test_model_instantiation()
