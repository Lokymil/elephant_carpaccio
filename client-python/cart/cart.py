from typing import List


class Cart:
    def __init__(self, prices: List[int], quantities: List[int], country: str, reduction: str):
        self.prices = prices
        self.quantitites = quantities
        self.country = country
        self.reduction = reduction
