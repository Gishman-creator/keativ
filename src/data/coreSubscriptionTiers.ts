export const CORE_SUBSCRIPTION_TIERS_RESPONSE = {
  "success": true,
  "tiers": [
    {
      "id": "13b4956c-6447-4e46-95ba-c8f76a2be525",
      "name": "basic",
      "display_name": "Basic",
      "description": "Perfect for individuals and small creators getting started",
      "price_monthly": 9.99,
      "price_yearly": 9.99,
      "features": {
        "max_social_accounts": 3,
        "max_scheduled_posts": 10,
        "max_team_members": 1,
        "analytics_retention_days": 30,
        "api_rate_limit": 1000,
        "gohighlevel_integration": false,
        "advanced_analytics": false,
        "priority_support": false,
        "white_label": false
      }
    },
    {
      "id": "a34912b1-ddd1-4ddf-85de-3577b6a00d36",
      "name": "professional",
      "display_name": "Professional",
      "description": "For growing businesses and marketing teams",
      "price_monthly": 14.99,
      "price_yearly": 14.99,
      "features": {
        "max_social_accounts": -1,
        "max_scheduled_posts": -1,
        "max_team_members": 5,
        "analytics_retention_days": 365,
        "api_rate_limit": 5000,
        "gohighlevel_integration": false,
        "advanced_analytics": true,
        "priority_support": true,
        "white_label": false
      }
    },
    {
      "id": "fd15d5c4-7c4b-4044-9018-0a953cd21124",
      "name": "enterprise",
      "display_name": "Enterprise",
      "description": "For large organizations with advanced needs",
      "price_monthly": 19.99,
      "price_yearly": 19.99,
      "features": {
        "max_social_accounts": -1,
        "max_scheduled_posts": -1,
        "max_team_members": -1,
        "analytics_retention_days": -1,
        "api_rate_limit": 20000,
        "gohighlevel_integration": true,
        "advanced_analytics": true,
        "priority_support": true,
        "white_label": true
      }
    }
  ]
}