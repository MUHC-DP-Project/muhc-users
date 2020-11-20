Feature: Login to the system
As a general user
I want to login to the system
so that i can access my account's services
  Scenario Outline:Login to account (Normal Flow)
    Given user does have an account with <email> and <password>
    When user requests to login with <email> <password>
    Then system should validate <email> and <password>
    And user is logged in
    Examples:
      | email                    | password         |
      | doctoratclinic@gmail.com | 123456           |
      | team54lokamdas@gmail.com | kajdsa9131       |

  Scenario Outline:Fail to login (Error Flow)
    Given user does have an account with <email> and <password>
    When user requests to login with <bad_email> and <bad_password>
    Then the <bad_email> and <bad_email> is incorrect
    And an wrong credentials error message is shown
    Examples:
      | email                    | password         | bad_email         | bad_password |
      | doctoratclinic@gmail.com | 123456           | xxxxx@gmail.com   | kkkmalda
      | team54lokamdas@gmail.com | kajdsa9131       | yyyyyy@gmail.com  | 1kkn12m3     |



