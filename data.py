# Define specific categories for "Manajemen Keuangan Perbankan"

# Updated values for each column tailored for Financial Management and Banking
bidang_pekerjaan_finance_banking = [
    "Perbankan", "Keuangan", "Investasi", "Analisis Risiko", "Akuntansi", 
    "Audit Internal", "Pembiayaan", "Manajemen Keuangan", "Manajemen Aset"
]

jenis_pekerjaan_finance_banking = [
    "Manajemen Keuangan", "Layanan Nasabah", "Analisis Kredit", "Manajemen Investasi",
    "Manajemen Risiko", "Pengelolaan Portofolio", "Pengelolaan Aset", "Manajemen Likuiditas",
    "Perencanaan Keuangan"
]

posisi_jabatan_finance_banking = [
    "Credit Analyst", "Financial Advisor", "Loan Officer", "Risk Analyst", 
    "Portfolio Manager", "Bank Teller", "Investment Analyst", "Internal Auditor", 
    "Financial Planner", "Accountant", "Asset Manager", "Customer Service Officer",
    "Treasury Analyst", "Compliance Officer", "Financial Consultant", 
    "Relationship Manager", "Finance Controller", "Branch Manager", 
    "Wealth Management Advisor", "Underwriter"
]

# Generate 250 rows of sample data for Financial Management and Banking
data_finance_banking = {
    "Bidang Pekerjaan": [random.choice(bidang_pekerjaan_finance_banking) for _ in range(250)],
    "Jenis Pekerjaan": [random.choice(jenis_pekerjaan_finance_banking) for _ in range(250)],
    "Posisi/Jabatan": [random.choice(posisi_jabatan_finance_banking) for _ in range(250)]
}

# Create DataFrame for Financial Management and Banking data
df_finance_banking = pd.DataFrame(data_finance_banking)

# Save the Financial Management and Banking data to Excel
output_path_finance_banking = "/home/atep/Picture/Data_Pekerjaan_Manajemen_Keuangan_Perbankan_LP3I.xlsx"
df_finance_banking.to_excel(output_path_finance_banking, index=False)

output_path_finance_banking
