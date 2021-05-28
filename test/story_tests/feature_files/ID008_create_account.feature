Feature: Create an account
As a general user
I want to create an account for the system
so that i can log in
  Scenario Outline:Creating an account (Normal Flow)
    Given user does not have an account with <email>
    When user requests creating account with <email> <password>
    Then user account with <email> is created
    Examples:
      | email                    | password         |
      | doctoratclinic@gmail.com | 123456           |
      | team54lokamdas@gmail.com | kajdsa9131       |
  Scenario Outline:Creating an already existing account (Error Flow)
    Given user does have an account with <email>
    When user requests creating account with <email> <password>
    Then system returns error message saying account exists
    Examples:
      | email                     | password         |
      | doctoratclinic@gmail.com  | 123456           |
      | existingaccount@gmail.com | 987654           |



  Scenario Outline:Creating an account with empty fields (Error Flow)
    Given user does not have an account with <email>
    When user requests creating account with <email>
    Then system returns error message saying missing fields
    Examples:
      | email                     |
      | doctoratclinic@gmail.com  |   
      | existingaccount@gmail.com |


