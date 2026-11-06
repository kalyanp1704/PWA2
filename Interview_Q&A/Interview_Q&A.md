# QA Automation Engineer Interview Questions and Answers

> Senior QA / QA Automation Engineer — Interview Preparation Notes

## 1. Core Java

### **Q1. What are the four pillars of OOP?**

**Answer:** The four pillars are encapsulation, inheritance,
polymorphism, and abstraction.
    - **Encapsulation**: Bundles data and methods and controls access to internal state.
    - **Inheritance**: Allows a child class to reuse or extend a parent class.
    - **Polymorphism**: Allows the same interface or method name to have different behavior. -
    - **Abstraction** : Hides implementation details and exposes essential functionality.

**Automation example:** POM classes encapsulate page locators and
actions; inheritance can share common functionality; interfaces support
abstraction; overriding enables runtime polymorphism.

### **Q2. Method overloading vs. overriding?**

**Answer:** Overloading means the same method name with different
parameter lists and is resolved at compile time. Overriding means a
subclass provides an implementation of an inherited method with the same
signature and is dispatched at runtime.

void login(String username) {}
void login(String username, String password) {}

class Parent {
    void test() { System.out.println("Parent"); }
}
class Child extends Parent {
    @Override
    void test() { System.out.println("Child"); }
}

### **Q3. == vs. .equals()?**

**Answer:** For objects, == compares references; .equals() checks
logical equality when implemented by the class. For primitives, ==
compares values.
String a = new String("Selenium");
String b = new String("Selenium");
System.out.println(a == b);      // false
System.out.println(a.equals(b)); // true
In automation, .equals() is commonly used to compare expected and
actual text.

### **Q4. ArrayList vs. LinkedList vs. HashSet?**

**Answer:** - **ArrayList**: maintains insertion order, permits
duplicates, fast indexed access. - **LinkedList**: maintains insertion
order, permits duplicates, efficient operations at the ends; indexed
access is usually slower. - **HashSet**: stores unique values and does not
guarantee iteration order. Use a list to collect web elements or product
names and a set to detect duplicate values.

### **Q5. How does HashMap work?**

**Answer:** HashMap stores key-value pairs. It uses a key's hash to
locate a bucket and uses equality checks to identify a key when
collisions occur. In Java 8+, heavily populated collision buckets can
become balanced trees under certain conditions. It allows one null key
and multiple null values and is not thread-safe by default. Adding an
existing key replaces its associated value.

### **Q6. Checked vs. unchecked exceptions?**

**Answer:** Checked exceptions must be caught or declared, such as
IOException. Unchecked exceptions extend RuntimeException, such as
NullPointerException and IllegalArgumentException. In automation,
handle exceptions at the appropriate level, log useful details, and
avoid swallowing errors with broad catch blocks.

### **Q7. Why is String immutable?**

**Answer:** A String cannot be changed after creation. Immutability
supports string-pool reuse, thread safety, and reliable behavior as a
hash-map key. Use StringBuilder for repeated string modifications.

## 2. Selenium WebDriver

### **Q8. What locators does Selenium support?**

**Answer:** ID, name, class name, tag name, link text, partial link
text, CSS selector, and XPath. Prefer stable, unique attributes. Use
XPath when relationships, text, or complex DOM structures require it.
driver.findElement(By.id("username"));
driver.findElement(By.cssSelector("input[name='email']"));
driver.findElement(By.xpath("//button[normalize-space()='Login']"));
Avoid brittle absolute XPath and dynamically generated attributes when
possible.

### **Q9. Implicit wait vs. explicit wait?**

**Answer:** Implicit wait applies globally to element searches. Explicit
wait waits for a specific condition. I generally prefer explicit waits
for dynamic applications because synchronization is targeted and
readable.
WebDriverWait wait =
    new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement button = wait.until(
    ExpectedConditions.elementToBeClickable(By.id("login")));
button.click();
Avoid mixing implicit and explicit waits because their interaction can
produce unpredictable wait durations.

### **Q10. How do you handle StaleElementReferenceException?**

**Answer:** It occurs when an element reference is no longer attached to
the current DOM, often after a refresh or re-render. Wait for the
relevant state and locate the element again rather than reusing an old
WebElement.
By submit = By.id("submit");
WebDriverWait wait =
    new WebDriverWait(driver, Duration.ofSeconds(10));
wait.until(ExpectedConditions.elementToBeClickable(submit)).click();

### **Q11. How do you handle multiple windows or tabs?**

**Answer:** Store the original handle, trigger the new window, wait
until the number of handles increases, switch to the new handle,
validate it, then return to the original handle if needed.
String parent = driver.getWindowHandle();
driver.findElement(By.id("openWindow")).click();

WebDriverWait wait =  new WebDriverWait(driver, Duration.ofSeconds(10));
wait.until(d -> d.getWindowHandles().size() > 1);

for (String handle : driver.getWindowHandles()) {
    if (!handle.equals(parent)) {
        driver.switchTo().window(handle);
        break;
    }
}
System.out.println(driver.getTitle());
driver.close();
driver.switchTo().window(parent);

### **Q12. How do you handle frames?**

**Answer:** Switch using the frame's name, ID, index, or WebElement.
Use parentFrame() to move up one level or defaultContent() to return
to the main page.
driver.switchTo().frame("paymentFrame");
// Interact with elements inside the frame.
driver.switchTo().parentFrame();

### **Q13. How do you handle JavaScript alerts?**

**Answer:** Switch to the alert, read its text, and accept, dismiss, or
enter text as needed.
Alert alert = driver.switchTo().alert();
System.out.println(alert.getText());
alert.accept();
Use an explicit wait when the alert appears asynchronously.

### **Q14. How do you handle dynamic elements?**

**Answer:** Use stable attributes and relative locators, wait for the
required state, avoid fixed sleeps, and re-locate elements after DOM
updates. Investigate the underlying behavior instead of repeatedly
retrying blindly.

### **Q15. findElement() vs. findElements()?**

**Answer:** findElement() returns the first matching element and
throws NoSuchElementException if none exists. findElements() returns
a list and returns an empty list when no elements match. Use it to count
results or validate whether elements are present.

## 3. TestNG

### **Q16. What are important TestNG annotations?**

**Answer:** - **@BeforeSuite**: before the suite. - **@BeforeTest**: before
a <test> block in testng.xml. - **@BeforeClass**: before the first
test method in a class. - **@BeforeMethod**: before each test method. -
@Test: marks a test method. - **@AfterMethod**: after each test
method. - **@AfterClass**: after test methods in a class. - **@AfterSuite**:
after the suite.

Use setup methods to initialize resources and teardown methods to clean
up reliably.

### **Q17. Hard assertion vs. soft assertion?**

**Answer:** A hard assertion stops the current test method when it
fails. A soft assertion records failures and continues until
assertAll() is called.
Assert.assertEquals(actualTitle, expectedTitle);

SoftAssert soft = new SoftAssert();
soft.assertEquals(actualTitle, expectedTitle);
soft.assertTrue(loginButton.isDisplayed());
soft.assertAll();
Use hard assertions when later steps depend on the result; use soft
assertions for multiple independent checks.

### **Q18. How do you take screenshots only for failed tests?**

**Answer:** Implement ITestListener and override onTestFailure().
Capture a screenshot with TakesScreenshot and save it using a unique
test name and timestamp. Ensure the correct driver is available for that
test thread, and handle file and I/O errors.
public void onTestFailure(ITestResult result) {
    WebDriver driver = DriverManager.getDriver();
    if (driver != null) {
        File source = ((TakesScreenshot) driver)
            .getScreenshotAs(OutputType.FILE);
        // Copy source to a unique destination path.
    }
}
DriverManager is a project-specific utility; implement it to suit your
framework.

### **Q19. How do you rerun failed TestNG tests?**

**Answer:** Review the generated reports and, in standard TestNG
reporting workflows, use testng-failed.xml to rerun failed tests.
Investigate whether failures are product defects, synchronization
problems, test-data issues, or environment instability. A passing retry
does not automatically make the original failure irrelevant.

### **Q20. What is a TestNG listener?**

**Answer:** A listener customizes behavior during test execution.
ITestListener provides callbacks for test start, success, failure, and
skip. Listeners can support screenshots, logs, and reporting.
ISuiteListener handles suite events; IAnnotationTransformer can
modify annotations programmatically.

### **Q21. How do you run tests in parallel?**

**Answer:** Configure parallel mode and thread count in testng.xml.
Each thread should have an independent WebDriver and isolated test data.
Avoid shared mutable state and race conditions.
<suite name="AutomationSuite" parallel="tests" thread-count="3">
    <test name="ChromeTests">
        <classes>
            <class name="tests.LoginTest"/>
        </classes>
    </test>
</suite>

### **Q22. dependsOnMethods vs. priority?**

**Answer:** priority influences test execution order.
dependsOnMethods establishes a dependency between methods. Prefer
independent tests so one failure does not block unrelated scenarios; use
dependencies only when the workflow requires them.

## 4. Framework Design

### **Q23. Explain your automation framework architecture.**

**Answer:** A typical framework may contain: 1. Test layer --- scenarios
and assertions. 2. Page layer --- locators and UI actions. 3. Driver
management --- browser lifecycle and per-thread drivers. 4. Utilities
--- waits, screenshots, configuration, and common helpers. 5. Test data
--- data providers or sources such as JSON, Excel, or databases. 6.
Reporting and logging --- results, failures, and execution details. 7.
CI/CD integration --- Jenkins or Git-based pipeline execution.

This separation improves maintainability, reduces duplication, and
supports extension. Describe only components that actually exist in your
framework.

### **Q24. What is Page Object Model (POM)?**

**Answer:** POM represents each page or component as a class containing
its locators and relevant actions. It separates UI details from test
logic, so locator changes can usually be handled in one place.
public class LoginPage {
    private WebDriver driver;
    private By username = By.id("username");
    private By password = By.id("password");
    private By loginButton = By.id("login");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
    }

    public void login(String user, String pass) {
        driver.findElement(username).sendKeys(user);
        driver.findElement(password).sendKeys(pass);
        driver.findElement(loginButton).click();
    }
}
Keep UI actions in page objects and scenario decisions/assertions
primarily in the test layer.

### **Q25. POM vs. PageFactory?**

**Answer:** POM is a design pattern; PageFactory is a Selenium mechanism
for initializing elements, traditionally with @FindBy. They are not
alternatives to one another. POM can be implemented with By locators
and explicit waits without PageFactory.

### **Q26. What is data-driven testing?**

**Answer:** It separates test logic from input data so one scenario can
run against multiple data sets. TestNG supports this through
@DataProvider and parameters; data can also come from JSON, Excel, or
databases.
@DataProvider(name = "loginData")
public Object[][] loginData() {
    return new Object[][] {
        {"validUser", "validPassword"},
        {"invalidUser", "invalidPassword"}
    };
}

@Test(dataProvider = "loginData")
public void verifyLogin(String username, String password) {
    // Execute login and validate the result.
}
Use controlled test data and secure handling of credentials.

### **Q27. How do you decide what to automate?**

**Answer:** Prioritize repeatable, stable, business-critical, and
frequently executed scenarios. Consider regression frequency, business
risk, stability, data availability, maintenance cost, and return on
investment. Automate smoke tests and valuable regression workflows
early; exploratory testing remains important.

### **Q28. How do you reduce flaky tests?**

**Answer:** Investigate root causes. Use explicit waits, stable
locators, independent tests, isolated data, correct browser lifecycle
management, and reliable assertions. Retries may help diagnose
intermittent issues, but should not conceal genuine defects.

## 5. API Testing

### **Q29. What is API testing?**

**Answer:** API testing validates communication between application
components without relying entirely on the UI. Validate requests,
headers, authentication, status codes, response bodies, schema, business
rules, persistence, and error handling. API tests can provide fast,
focused feedback.

### **Q30. Common HTTP status codes?**

  Code   Meaning                 Example
  200    OK                      Successful GET
  201    Created                 Resource created
  204    No Content              Success without response body
  400    Bad Request             Invalid request
  401    Unauthorized            Missing/invalid authentication
  403    Forbidden               Insufficient permission
  404    Not Found               Resource missing
  409    Conflict                Duplicate/conflicting resource
  422    Unprocessable Content   Business validation failure
  429    Too Many Requests       Rate limit exceeded
  500    Internal Server Error   Unexpected server error

Expected codes depend on the API contract; validate business outcomes
too.

### **Q31. PUT vs. PATCH?**

**Answer:** PUT generally replaces a resource representation; PATCH
applies partial changes. Validate omitted fields, invalid data, repeated
requests, and consistency according to the API specification.

### **Q32. Authentication vs. authorization?**

**Answer:** Authentication establishes who a user/client is.
Authorization determines what that identity can access. Test
invalid/expired credentials, insufficient permissions, and attempts to
access another customer's resources.

### **Q33. How do you validate an API using Rest Assured?**

**Answer:** Build the request, set headers and payload, execute it, and
validate status, response fields, and business rules.
given()
    .baseUri("https://api.example.com")
    .header("Content-Type", "application/json")
    .body("{\"name\":\"Test User\"}")
.when()
    .post("/customers")
.then()
    .statusCode(201)
    .body("name", equalTo("Test User"));
Use the required Rest Assured imports and configured environment. Do not
hardcode secrets in real projects.

### **Q34. How do you test a payment API?**

**Answer:** Validate successful and unsuccessful payments, invalid
amounts/currencies/accounts, insufficient funds, authentication,
duplicate requests, idempotency, concurrent requests, timeouts/retries,
transaction status, ledger consistency, authorization, audit logs, and
sensitive-data protection. Check persisted state, not just HTTP status.

## 6. SQL and Data Validation

### **Q35. What are SQL joins?**

**Answer:** - **INNER JOIN**: matching rows from both tables. -
LEFT JOIN: all left rows and matching right rows. - **RIGHT JOIN**: all
right rows and matching left rows. - **FULL OUTER JOIN**: matched and
unmatched rows from both tables, where supported.

Joins help validate relationships between customers, accounts, payments,
and transactions.

### **Q36. How do you find duplicate transactions?**

SELECT transaction_reference, COUNT(*) AS duplicate_count
FROM transactions
GROUP BY transaction_reference
HAVING COUNT(*) > 1;
**Answer:** Group by the business key that should be unique. Confirm the
data model first because multiple records can legitimately share a
reference in some systems.

### **Q37. How do you find the second-highest distinct salary?**

SELECT employee_id, salary
FROM (
    SELECT employee_id, salary,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS salary_rank
    FROM employees
) ranked
WHERE salary_rank = 2;
DENSE_RANK() handles tied salaries and returns employees with the
second-highest distinct salary.

### **Q38. How do you compare payment and ledger data?**

SELECT p.transaction_reference,
       p.amount AS payment_amount,
       l.amount AS ledger_amount,
       p.status AS payment_status,
       l.status AS ledger_status
FROM payments p
JOIN ledger_entries l
  ON p.transaction_reference = l.transaction_reference
WHERE p.amount <> l.amount
   OR p.status <> l.status;
This is illustrative. Real financial validation must account for
multiple ledger entries, currencies, missing records, and NULL values.

### **Q39. How do you validate a transfer debit and credit?**

**Answer:** Check source and destination balances, transaction
amount/status, and ledger entries. For a ₹1,000 transfer, the source
should be debited ₹1,000 and the destination credited ₹1,000, subject to
fees and accounting rules. Verify no duplicate financial effects and no
inconsistent balances after a failure or rollback.

## 7. CI/CD and Git

### **Q40. How do you integrate automation with Jenkins?**

**Answer:** A typical pipeline checks out code, configures Java/Maven
and test settings, runs tests, publishes reports, and notifies the team.
pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Run Automation') {
            steps { sh 'mvn clean test' }
        }
    }
    post {
        always {
            junit testResults: '**/surefire-reports/*.xml',
                  allowEmptyResults: true
        }
    }
}
Adjust shell commands, browser setup, credentials, and report paths to
the actual Jenkins agent and framework.

### **Q41. CI vs. Continuous Delivery vs. Continuous Deployment?**

**Answer:** - **CI**: Frequently integrate code and run automated
builds/tests. - **Continuous Delivery**: Keep changes tested and ready
to release; production release may require approval. - Continuous
Deployment: Automatically deploy changes that pass required checks. QA
supports this by maintaining reliable automated tests and providing
clear quality signals.

### **Q42. What do you do when a pipeline fails?**

**Answer:** Review logs, test reports, and screenshots. Classify the
cause as product defect, script issue, environment, data, or
infrastructure. Reproduce where possible, fix/report the root cause,
rerun appropriate tests, and communicate release impact. Do not declare
success solely because a retry passes.

### **Q43. Common Git commands?**

git clone <repository-url>
git checkout -b feature/automation-tests
git status
git add .
git commit -m "Add payment API tests"
git push origin feature/automation-tests
git pull
**Answer:** Use branches, meaningful commits, code reviews, and
team-approved workflows. Resolve merge conflicts carefully.

## 8. QA Fundamentals

### **Q44. Regression testing vs. retesting?**

**Answer:** Retesting verifies that a specific defect has been fixed.
Regression testing checks whether the change affected existing
functionality. After fixing a payment defect, retest that scenario and
run related regression tests for payment methods, transaction history,
and balance updates.

### **Q45. Explain the defect lifecycle.**

**Answer:** A typical flow is New → Assigned → In Progress → Fixed/Ready
for Retest → Retest. If validation passes, close the defect; if it
fails, reopen it. Exact statuses depend on the organization and tool.

A good defect report includes reproduction steps, actual/expected
results, evidence, severity, priority, and environment. Retest fixes and
perform impact-based regression before closure.

### **Q46. Severity vs. priority?**

**Answer:** Severity is the impact of a defect; priority is how urgently
it should be fixed. Duplicate financial debits are generally high
severity and priority. A minor UI issue may have low severity, but its
priority can rise if it affects a major launch.

### **Q47. How do you choose regression scope?**

**Answer:** Use risk-based testing and impact analysis. Consider changed
components, dependencies, critical workflows, historical defects,
integrations, and likelihood/impact of failure. Run smoke tests first,
then targeted or broader regression based on release risk, time, and
results.

### **Q48. What should a test strategy include?**

**Answer:** Scope, objectives, test levels/types, environments, test
data, automation approach, roles, entry/exit criteria, defect
management, risks, dependencies, and reporting. Align effort with
business risk and provide evidence for release decisions.

### **Q49. What if a developer cannot reproduce your bug?**

**Answer:** Recheck the environment, data, and steps. Capture logs,
screenshots, API responses, timestamps, and configuration details. For
intermittent failures, investigate timing, concurrency, and
dependencies. Discuss evidence collaboratively and work toward root
cause.

## 9. Banking Domain

### **Q50. How would you test a fund transfer?**

**Answer:** Test valid transfers, insufficient funds, invalid/inactive
beneficiaries, invalid amounts, duplicate submissions, timeouts,
concurrent transfers, debit/credit accuracy, transaction history,
status, authorization, and audit logs. Verify UI/API/database/ledger
state where access is available.

### **Q51. How do you test duplicate transactions?**

**Answer:** Repeat a request using the same logical transaction or
idempotency key. Verify no unintended duplicate debit/credit, consistent
transaction status and reference, and correct ledger state. Test
concurrent requests and retries after timeouts. Expected response codes
depend on the API contract.

### **Q52. What is idempotency?**

**Answer:** Repeating the same logical operation under defined
conditions should not create additional unintended effects. For example,
retrying a timed-out payment with the same idempotency key should not
debit twice. Test repeated/concurrent requests, timeout recovery, key
reuse with changed payloads, and in-progress requests.

### **Q53. What if money is debited but the response fails?**

**Answer:** Establish whether the transaction committed. Check
transaction reference/status, balances, ledger entries, and
reconciliation records. Validate status inquiry, safe retries,
asynchronous updates, and reversals if supported. Do not blindly
resubmit until the state is known.

### **Q54. How do you test banking security?**

**Answer:** Test authentication, authorization, session management,
access controls, input validation, and sensitive-data protection. Verify
customers cannot access other customers' accounts, expired tokens are
rejected, and security failures do not expose private or financial
information.

### **Q55. What is an audit trail?**

**Answer:** An audit trail records important actions such as transaction
creation, approvals, status changes, and reversals. Verify required
event details, timestamps, actor/system identity, traceability, access
restrictions, and retention rules.

### **Q56. How do you test a long-pending transaction?**

**Answer:** Validate permitted state transitions and processing-time
expectations. Test delayed responses, polling, callbacks, retries,
reconciliation, and eventual success/failure. Ensure no duplicate debit
or credit occurs while the status is unresolved.

## 10. Project and Behavioral Questions

### **Q57. Tell me about yourself.**

**Sample answer — personalize before using:**

I am a Senior QA Automation Engineer with around five years of
experience in software testing, including manual testing, UI automation,
and API testing.

My primary automation expertise is Java, Selenium WebDriver, TestNG,
Cucumber, and the Page Object Model. I have experience designing and
maintaining automation frameworks, creating reusable components, and
integrating automated test suites into CI/CD pipelines using Jenkins and
GitLab.

My responsibilities include understanding business requirements,
preparing test scenarios, executing functional and regression testing,
identifying defects, and validating fixes. I also have experience with
API testing using Postman and collaborating with developers, product
owners, and QA engineers in Agile environments.

One of my key achievements was improving automation coverage from
approximately 30% to 70%, helping reduce repetitive regression effort
and improve release confidence.

I focus on building maintainable automation solutions, identifying risks
early, and ensuring that releases meet functional and business
requirements.

**Note:** Use only the experience, tools, and metrics that accurately
reflect your work.

### **Q58. Explain your framework in detail.**

**Answer:** Explain your actual stack, test layer, page layer, driver
management, utilities, data management, reporting, and CI/CD
integration. Describe how waits, assertions, configuration, and failure
investigation work. Be ready to explain why you chose each design
decision.

### **Q59. How did you increase automation coverage from 30% to 70%?**

**Sample answer:** I reviewed the existing suite, identified high-value
manual regression scenarios, prioritized stable and business-critical
workflows, and automated them with reusable components. I monitored
failures, improved reliability, and integrated tests into CI/CD. This
increased coverage from approximately 30% to 70%.

Be ready to define what coverage measured, the baseline, the time
period, and the actual time savings. Do not invent numbers.

### **Q60. What was your biggest automation challenge?**

**Sample answer:** One challenge was intermittent failures caused by
dynamic UI elements and synchronization. I investigated failure
patterns, replaced fixed sleeps with explicit waits, improved locator
stability, and re-located elements after DOM changes. This improved
reliability and reduced unnecessary investigation effort.

Use this answer only if it reflects a real challenge you faced. Other
valid topics include test data, parallel execution, or CI environment
differences.

### **Q61. How do you measure automation success?**

**Answer:** Track automation coverage, regression duration, pass rate,
flaky-test rate, defects caught before production, maintenance effort,
pipeline reliability, and critical workflow coverage. The number of
scripts alone does not prove success; tests must be reliable and
maintainable.

### **Q62. What if a production defect was missed?**

**Answer:** Reproduce and assess the issue, then investigate why testing
missed it: missing coverage, weak assertions, data limitations,
environment differences, integration behavior, or an untested edge case.
Add appropriate regression coverage after the fix and review related
workflows.

### **Q63. Why should we hire you?**

**Sample answer:** I bring hands-on automation expertise, strong testing
fundamentals, and an understanding of business-critical workflows. I can
contribute to framework maintenance, high-value regression automation,
API and backend validation, CI/CD execution, and defect investigation. I
focus on identifying risks early and improving confidence in software
releases.
