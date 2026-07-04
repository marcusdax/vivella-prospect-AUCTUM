# src/ai/contractor/survival_risk.py
import pandas as pd
from lifelines import CoxPHFitter

class ContractorRiskPredictor:
    def __init__(self):
        self.cph = CoxPHFitter()

    def fit_model(self, dataframe):
        # Fits survival duration based on workload, rating, and change orders
        # Dataframe columns: ['duration_weeks', 'abandoned', 'current_workload', 'rating', 'change_order_count']
        self.cph.fit(
            df=dataframe, 
            duration_col='duration_weeks', 
            event_col='abandoned'
        )

    def predict_survival_probability(self, contractor_features, time_weeks):
        return self.cph.predict_survival_function(contractor_features, times=[time_weeks]).values[0][0]

if __name__ == "__main__":
    # Validate with mockup data
    data = pd.DataFrame({
        'duration_weeks': [10, 5, 24, 12, 18, 4, 30, 2],
        'abandoned': [0, 1, 0, 0, 1, 1, 0, 1],
        'current_workload': [2, 5, 1, 3, 4, 6, 1, 7],
        'rating': [4.8, 3.2, 4.9, 4.2, 3.8, 2.5, 4.7, 2.1],
        'change_order_count': [1, 4, 0, 2, 3, 5, 1, 6]
    })
    predictor = ContractorRiskPredictor()
    predictor.fit_model(data)
    test_contractor = pd.DataFrame([{'current_workload': 3, 'rating': 4.1, 'change_order_count': 1}])
    prob = predictor.predict_survival_probability(test_contractor, time_weeks=10)
    print(f"[Contractor Risk] Probability of survival through week 10: {prob:.2%}")
