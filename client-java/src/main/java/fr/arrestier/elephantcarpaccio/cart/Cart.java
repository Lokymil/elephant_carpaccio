package fr.arrestier.elephantcarpaccio.cart;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class Cart {
    public List<Integer> prices;
    public List<Integer> quantities;
    public String country;
    public String reduction;

    public Cart(List<Integer> prices, List<Integer> quantities, String country, String reduction) {
        this.prices = prices;
        this.quantities = quantities;
        this.country = country;
        this.reduction = reduction;
    }

    public Cart(JSONObject jsonCart) {
        this.prices = new ArrayList<>();
        try {
            JSONArray prices = jsonCart.getJSONArray("prices");
            for (int i = 0; i < prices.length(); i++) {
                this.prices.add(prices.getInt(i));
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        this.quantities = new ArrayList<>();
        try {
            JSONArray quantities = jsonCart.getJSONArray("quantities");
            for (int i = 0; i < quantities.length(); i++) {
                this.quantities.add(quantities.getInt(i));
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        try {
            this.country = jsonCart.getString("country");
        } catch (JSONException e) {
            e.printStackTrace();
            this.country = "";
        }

        try {
            this.reduction = jsonCart.getString("reduction");
        } catch (JSONException e) {
            e.printStackTrace();
            this.reduction = "";
        }
    }
}
