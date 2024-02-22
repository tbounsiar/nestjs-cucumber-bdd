Feature: Company API

  Background:
    Given The following data:
      |tableName|sqlFile|csvFile|
      |address|address.sql|address.csv|
      |company|company.sql|company.csv|


  Scenario Outline: Get Url Path
    When GET "<url>" path
    Then The http response status to be <status>
    And The http response body to be like content of "<jsonFile>" file
    Examples:
      | url | status | jsonFile |
      | /api/v1/company | 200 | company.list.json |
      | /api/v1/company/1 | 200 | company.1.json |
      | /api/v1/company/404 | 404 | company.404.json |