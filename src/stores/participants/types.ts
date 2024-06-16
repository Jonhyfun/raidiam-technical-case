type CertificationRedirectEnum = 'FAPI Adv. OP w/ MTLS' | 'FAPI Adv. OP w/ MTLS, PAR' | 'FAPI Adv. OP w/ Private Key' | 'FAPI Adv. OP w/ Private Key, PAR';
type CertificationCibaEnum = 'FAPI-CIBA OP poll w/ MTLS' | 'FAPI-CIBA OP poll w/ Private Key' | 'FAPI-CIBA OP Ping w/ MTLS' | 'FAPI-CIBA OP Ping w/ Private Key';
type CertificationDCREnum = 'DCR Signed payload - JWT' | 'DCR Unsigned payload- JSON';

interface OrganisationAuthorityClaim {
  OrganisationId: string;
  OrganisationAuthorityClaimId: string;
  AuthorityId: string;
  Status: 'Active' | 'Inactive';
  AuthorisationDomain: string;
  Role: string;
  Authorisations: {
    Status: 'Active' | 'Inactive';
    MemberState: string; // Assuming this is a two-letter code
  }[];
  RegistrationId: string;
}

interface OrganisationAuthorityDomainClaim {
  OrganisationAuthorityDomainClaimId: string;
  AuthorisationDomainName: string;
  AuthorityId: string;
  AuthorityName: string;
  RegistrationId: string;
  Status: 'Active' | 'Inactive';
}

interface AuthorisationServerCertification {
  CertificationStartDate: string; // Assuming this is a date string
  CertificationExpirationDate: string; // Assuming this is a date string
  CertificationId: string;
  AuthorisationServerId: string;
  Status: 'Awaiting Certification' | 'Certified' | 'Deprecated' | 'Rejected' | 'Self-Certified';
  ProfileVariant: CertificationCibaEnum | CertificationRedirectEnum | CertificationDCREnum;
  ProfileVersion: number;
  CertificationURI: string;
}

interface ApiDiscoveryEndpoint {
  ApiDiscoveryId: string;
  ApiEndpoint: string;
}

interface ApiResource {
  ApiResourceId: string;
  ApiVersion: string;
  ApiDiscoveryEndpoints: ApiDiscoveryEndpoint[];
  FamilyComplete: boolean;
  ApiCertificationUri: string;
  CertificationStatus: 'Awaiting Certification' | 'Certified' | 'Deprecated' | 'Rejected' | 'Self-Certified';
  CertificationStartDate: string; // Assuming this is a date string
  CertificationExpirationDate: string; // Assuming this is a date string
  ApiFamilyType: string;
}

interface AuthorisationServer {
  AuthorisationServerId: string;
  OrganisationId: string;
  AutoRegistrationSupported: boolean;
  SupportsCiba: boolean;
  SupportsDCR: boolean;
  ApiResources: ApiResource[];
  AuthorisationServerCertifications: AuthorisationServerCertification[];
  CustomerFriendlyDescription: string;
  CustomerFriendlyLogoUri: string;
  CustomerFriendlyName: string;
  DeveloperPortalUri: string;
  TermsOfServiceUri: string;
  OpenIDDiscoveryDocument: string;
  Issuer: string;
  PayloadSigningCertLocationUri: string;
  ParentAuthorisationServerId: string;
}

export interface ParticipantObject {
  OrganisationId: string;
  Status: 'Active' | 'Pending' | 'Withdrawn';
  OrganisationName: string;
  CreatedOn: string; // Assuming this is a date/time string
  LegalEntityName: string;
  CountryOfRegistration: string;
  CompanyRegister: string;
  Tag: string;
  Size: string;
  RegistrationNumber: string;
  RegistrationId: string;
  RegisteredName: string;
  AddressLine1: string;
  AddressLine2: string;
  City: string;
  Postcode: string;
  Country: string;
  ParentOrganisationReference: string;
  AuthorisationServers: AuthorisationServer[];
  OrgDomainClaims: OrganisationAuthorityDomainClaim[];
  OrgDomainRoleClaims: OrganisationAuthorityClaim[];
}