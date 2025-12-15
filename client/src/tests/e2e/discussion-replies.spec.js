import { chromium } from "@playwright/test";

const BASE_URL = 'http://localhost:5000';

async function testDiscussionReplies() {
  console.log("\nRunning Discussion Reply Test Suite\n");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Test 1: Navigate to Forum Page
    console.log("Test 1: Navigate to forum page");
    await page.goto(`${BASE_URL}/forum`);
    await page.waitForSelector('[data-testid="text-discussions-heading"]');
    console.log("Forum page loaded");

    // Test 2: Open a discussion
    console.log("Test 2: Open first discussion");
    await page.locator('[data-testid="card-discussion"]').first().click();
    await page.waitForSelector('[data-testid="page-discussion-detail"]');
    console.log("Discussion detail page opened");

    // Test 3: Reply input exists
    console.log("Test 3: Verify reply input exists");
    const hasTextbox = await page.isVisible("textarea");
    if (!hasTextbox) throw new Error("Reply textbox not found");
    console.log("Reply textbox is visible");

    // Test 4: Type a reply
    console.log("Test 4: Type a reply");
    const replyText = "Automated reply test";
    await page.fill("textarea", replyText);
    console.log("Reply typed");

    // Test 5: Submit reply
    console.log("Test 5: Submit reply");
    await page.click("text=Post Reply");
    await page.waitForTimeout(500);
    console.log("Reply submitted");

    // Test 6: Verify reply appears
    console.log("Test 6: Verify reply appears");
    const replyVisible = await page.isVisible(`text=${replyText}`);
    if (!replyVisible) throw new Error("Reply did not appear in UI");
    console.log("Reply displayed correctly");

    // Test 7: Refresh and verify reply does not persist (expected)
    console.log("Test 7: Refresh page");
    await page.reload();
    const replyPersisted = await page.isVisible(`text=${replyText}`);

    if (replyPersisted) {
      console.log("Warning: Reply persisted after refresh (unexpected)");
    } else {
      console.log("Reply does not persist after refresh (expected)");
    }

    console.log("\nDiscussion Reply Test Suite Completed\n");

  } catch (error) {
    console.error("Test failed:", error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

testDiscussionReplies().catch(error => {
  console.error("Test suite failed:", error);
  process.exit(1);
});