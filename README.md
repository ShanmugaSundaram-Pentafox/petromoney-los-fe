# PetroMoney

## Overview
PetroMoney is the brand name of **Green Malabar Finance Ventures Limited (GMFVL)**, a Non-Banking Financial Company (NBFC) based in Chennai, India. The company focuses on transforming petrol stations into vibrant commercial hubs by providing financial, revenue, and cost-saving solutions.

## Services
### **Financing Solutions**
- **Fuel Credit**
- **Toll Charge Finance**
- **Receivables Finance**

### **Revenue Solutions**
- **Payment Services**
- **Insurance & Accessories Distribution**
- **Warehousing**

### **Cost-saving Solutions**
- **Rooftop Solar**
- **Bulk Insurance**
- **Market Analytics**

## Leadership Team
- **Akash Mehta** - Chairman
- **Suresh Gurumani** - Chief Executive Officer
- **Ramesh R** - Chief Digital Officer
- **Ramachandran Chellam** - Chief Financial Officer
- **Srinivasan Narayanswamy** - Co-Founder & Head of Business Development

# Getting Started

## Prerequisites for a React Project

### **1. System Requirements**
- **Node.js (use 18 LTS version)**  
  Install from [Node.js official website](https://nodejs.org/). It includes npm (Node Package Manager), which is required for package management.

- **Package Manager** :  
  - **yarn** (`npm install -g yarn`) 

- **Code Editor (Recommended: VS Code)**  
  Install from [VS Code official website](https://code.visualstudio.com/).

---

### **2. Basic Knowledge Requirements**
- **JavaScript**  
  Understanding of JavaScript features like:
  - Basic Hooks
  - Conditional Statements
  - Functions
  - Promises & Async/Await
  
- **HTML & CSS Basics**  
  Knowledge of styling and structuring UI elements.

- **Basic Git & GitHub Usage**  
  Version control for collaborative development. refer to .husky/_/commit-msg file for valid commit format. 

---

### **3. Project Technologies**
This project uses the following technologies and libraries:
- **[Mantine UI](https://mantine.dev/)** - A modern UI component library for building React applications.
- **[TanStack Query](https://tanstack.com/query/latest)** - For efficient API data fetching, caching, and synchronization.
- **[Zustand](https://zustand-demo.pmnd.rs/)** - A lightweight and easy-to-use state management library.
- **[TanStack React Table](https://tanstack.com/table/latest)** - For creating powerful, customizable tables in React applications.

## Steps to Clone the Repository
1. **Get repository access**
   - Send an email request for access to the repository.
2. **Access Bitbucket**
   - Log in to [Bitbucket](https://bitbucket.org/).
3. **Copy the HTTP Clone URL**
   - Navigate to the repository and copy the HTTP clone URL.
4. **Clone the Repository**
   - Open a path to save repository through terminal and run:
     ```sh
     git clone <repository-url>
     cd <repository-folder>
     ```

# Local Development Setup

## Setup Instructions
1. **Create a `.env` file**  
   Configure the necessary environment variables in a `.env` file.
   add the below lines in the .env file.
   REACT_APP_ENV=development
   REACT_APP_API_BASE=https://api-uat.petromoney.in/api/

1. **Ensure You Are in the `dev-los` Branch**  
   Check your current branch and switch to `dev-los`:  
   ```sh
   git branch --show-current
   ```
   If you are not in the `dev-los` branch, switch to it using:
   ```sh
   git checkout dev-los
   git branch --show-current
   ```

2. **Install Dependencies**  
   Run the following command to install project dependencies:  
   ```sh
   yarn install

3. **Start the development server using**
   Run the following command to start development server pointing uat locally.
   ```sh
   npm start

# UAT Deployment Guide

Follow these steps to push your changes to UAT for client testing:

1. **Push Changes to Bitbucket**
Push the branch you have worked on to Bitbucket.

2. **Trigger the AWS Pipeline**
If you have access to AWS Pipeline, open the mdm-uat pipeline.
Change the source branch to your branch.
Save and release the changes.

3. **Approve the Deployment**
Once the pipeline reaches the Approval Stage, provide approval comments.
The changes will be deployed to UAT after the build completes.

4. **Verify Changes in UAT**
Check if the changes are visible on the UAT URL [MDM-UAT](https://mdm-uat.petromoney.in/).
If not, open CloudFront and create a new Invalidation (or copy an existing one).
This clears the cache and ensures the changes are reflected in UAT.
Your changes should now be live in UAT for client testing!

# PRODUCTION Deployment Guide

Once the client approves the changes, follow these steps to deploy to production:

1. **Raise a Pull Request to dev-los**
Create a pull request (PR) in Bitbucket from your working branch to dev-los.
Merge the PR after approval.

2. **Sync dev-los Locally**
Checkout to dev-los locally:
```
sh
git checkout dev-los
```
Pull the latest changes:
```
sh
git pull origin dev-los
```

3. **Create a Release Branch**
Create a new release branch from dev-los following the naming convention rc/(date or version):
```
sh
git checkout -b rc/2024-02-10  # Example for February 10, 2024
```

Run the release command:
sh
```
npm run release
```

Push the release branch:
```
sh
git push origin rc/2024-02-10
```

4. **Raise a PR from Release Branch to dev-los**
Create another pull request to merge the release branch (rc/...) back into dev-los.
Merge it after approval.

5. **Merge dev-los into prod-los**
Raise a PR to merge dev-los into prod-los.
Once merged, the changes will go to the AWS petromoney-fe-prod pipeline.

6. **Production Deployment Approval**
If approved, the changes will be deployed to production automatically in a few minutes.

7. **Ensure Changes Are Visible**
If the changes are not visible in the production URL, open CloudFront.
Create a new invalidation or copy an existing invalidation.
This clears the cache and ensures the latest changes are reflected in production.