Feature: Create an account
As a general user
I want to create an account for the system
so that i can log in
  Scenario Outline:Creating an account (Normal Flow)
    Given user does not have an account with <email>
    When user requests creating account with <email> <password> <phoneNumber>, <clinicName> and <role>
    Then user account with <email> is created
    Examples:
      | email                    | password         | phoneNumber | clinicName                | role   |
      | doctoratclinic@gmail.com | 123456           | 4285149890  | Montreal General Hospital | Doctor |
      | team54lokamdas@gmail.com | kajdsa9131       | 4315851490  | Montreal Jewish Hospital  | Nurse  |
  Scenario Outline:Creating an already existing account (Error Flow)
    Given user does have an account with <email>
    When user requests creating account with <email> <password> <phoneNumber>, <clinicName> and <role>
    Then system returns error message saying account exists
    Examples:
      | email                     | password         | phoneNumber | clinicName                | role        |
      | doctoratclinic@gmail.com  | 123456           | 4285149890  | Montreal General Hospital | Doctor      |
      | existingaccount@gmail.com | 987654           | 1111111111  | McGill  Health  Center    | Researcher  |



  Scenario Outline:Creating an account with empty fields (Error Flow)
    Given user does not have an account with <email>
    When user requests creating account with <email> <phoneNumber>, <clinicName> and <role>
    Then system returns error message saying account exists
    Examples:
      | email                     | phoneNumber   | clinicName                | role        |
      | doctoratclinic@gmail.com  |   4285149890  | Montreal General Hospital | Doctor      |
      | existingaccount@gmail.com |  1111111111   | McGill  Health  Center    | Researcher  |


