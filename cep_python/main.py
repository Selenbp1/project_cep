from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
#import sys
# print(sys.path)

import router.rule_api as rule_api
import router.facility_api as facility_api
import router.data_api as data_api
import router.common_code_api as common_code_api
import router.user_api as user_api
import router.login as login

app = FastAPI(
    title="CEP_API"
)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_api.router)
app.include_router(rule_api.router)
app.include_router(facility_api.router)
app.include_router(data_api.router)
app.include_router(common_code_api.router)
app.include_router(login.router)